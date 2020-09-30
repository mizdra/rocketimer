import React from 'react';
import { perf, RenderTimeField, wait } from 'react-performance-testing';
import { render, fireEvent, screen } from '@testing-library/react';
import 'jest-performance-testing';
import { App } from '../App';
import { RecoilRoot } from 'recoil';
import { TestableTimerController } from '../lib/timer/timer-controller';

// タイマーが 60 fps で描画されることをテストする。
// react-performance-testing を使い、仮想 DOM における描画の処理時間を見て、
// 60 fps を実現できる時間に収まっているかを assert している。
// 厳密にはテストを実行する環境のスペックに応じて処理時間は変わってくるので、
// このテストに通ったからといってユーザ環境でも 60 fps で動作するとは言えない。
// とはいえ CI によって自動で異常なパフォーマンス劣化を検知できるという
// メリットがあるので、これで良しとしている。

beforeAll(() => {
  window.HTMLMediaElement.prototype.play = async () => {};
  window.performance.mark = () => {};
  window.performance.measure = () => {};
});

test('should measure re-render time when state is updated with multiple of the same component', async () => {
  const now = Date.now();
  const timerController = new TestableTimerController(now);

  // パフォーマンスの測定を開始
  const { renderTime } = perf<{ TimerTimeline: unknown; TimerRemainDisplay: unknown }>(React);

  render(
    <RecoilRoot>
      <App timerController={timerController} />
    </RecoilRoot>,
  );

  // カウントダウンを開始させる
  fireEvent.click(screen.getByTestId('start-countdown-button'));

  // NOTE: 一度も実行されたことのないコードは JIT の最適化が施されていないため、最初のうちは実行する度に
  // コンパイルし直され、次第に実行時間が短くなっていく。その結果、コンポーネントの更新時間が最初の 10 回の
  // 更新と次の 10 回の更新とでは差が出てしまう。これはグラフなどにして測定結果をまとめる際にも扱いづらい
  // という問題を引き起こす。
  //
  // そのため、ここでは測定前に 600 回 (10秒分) ほどタイマーを更新しておき、JIT の最適化を誘発させている。
  // ちなみにこれは一般に「暖機運転」と呼ばれている。
  for (let i = 0; i < 10 * 60; i++) {
    timerController.advanceTo(now);
  }

  let hotTimerTimelineField!: RenderTimeField;
  let hotTimerRemainDisplayField!: RenderTimeField;
  await wait(() => {
    hotTimerTimelineField = renderTime.current.TimerTimeline;
    hotTimerRemainDisplayField = renderTime.current.TimerRemainDisplay;
  });

  // GC を強制的に発生させておく
  global.gc();

  // 360 回 (1分ぶん) animation frame を発生させる
  // NOTE: 360 回としているのは GC による停止時間を更新時間に折り込みたいため
  // TODO: GC が 少なくとも数回発生していることを assert する
  for (let i = 0; i < 1 * 60 * 60; i++) {
    timerController.advanceTo(now);
  }

  await wait(() => {
    const targetTimerTimelineField: RenderTimeField = {
      mount: hotTimerTimelineField.mount,
      updates: renderTime.current.TimerTimeline.updates.slice(hotTimerTimelineField.updates.length),
    };
    const targetTimerRemainDisplayField: RenderTimeField = {
      mount: hotTimerRemainDisplayField.mount,
      updates: renderTime.current.TimerRemainDisplay.updates.slice(hotTimerRemainDisplayField.updates.length),
    };
    console.log(targetTimerTimelineField);
    console.log(targetTimerRemainDisplayField);
    // 以下のような方針でテストをする。
    //
    // - 毎フレーム更新されるコンポーネントは TimerTimeline と TimerRemainDisplay の2つだけ
    //   - そのため TimerTimeline と TimerRemainDisplay の更新時間のみを assert する
    // - 60 fps を実現するには 1 フレームあたり 10 ms 秒以内に処理が完了していると良い、とされている
    //   - ref: https://web.dev/rail/#animation:-produce-a-frame-in-10-ms
    //   - そこで累計更新時間が 10 ms 以内になっていることを assert で確かめることとする
    // - react-performance-testing によるテストは仮想 DOM によるテストであり、DOM API のオーバーヘッドが考慮されていない
    //   - そこで上限とする累計更新時間を 10 ms から更に縮めて 8ms とする
    // - しかしよくよく考えるとテストは development build で実行される
    //   - という訳で累計更新時間を 8ms から 16 ms に伸ばす
    //   - (本当は production build でテストするべきだけど、@testing-library/react が production build でのテストに対応していないので諦めている)
    expect(targetTimerTimelineField).toBeUpdatedWithin(4);
    expect(targetTimerRemainDisplayField).toBeUpdatedWithin(4);
  });
});
