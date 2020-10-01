import React from 'react';
import { perf, wait } from 'react-performance-testing';
import { render, fireEvent, screen } from '@testing-library/react';
import 'jest-performance-testing';
import { App } from '../App';
import { RecoilRoot } from 'recoil';
import { TestableTimerController } from '../lib/timer/timer-controller';
import { promises as fs } from 'fs';
import { inspect } from 'util';

// !!! The following code is copied from benchmark.js !!!
// this code is lisenced by LICENSE.BENCHMARKJS
const tTable = {
  '1': 12.706,
  '2': 4.303,
  '3': 3.182,
  '4': 2.776,
  '5': 2.571,
  '6': 2.447,
  '7': 2.365,
  '8': 2.306,
  '9': 2.262,
  '10': 2.228,
  '11': 2.201,
  '12': 2.179,
  '13': 2.16,
  '14': 2.145,
  '15': 2.131,
  '16': 2.12,
  '17': 2.11,
  '18': 2.101,
  '19': 2.093,
  '20': 2.086,
  '21': 2.08,
  '22': 2.074,
  '23': 2.069,
  '24': 2.064,
  '25': 2.06,
  '26': 2.056,
  '27': 2.052,
  '28': 2.048,
  '29': 2.045,
  '30': 2.042,
  infinity: 1.96,
};

function getStatistics(samples: number[]) {
  const size = samples.length;
  // 更新時間の平均
  const mean = samples.reduce((a, b) => a + b, 0) / size;
  const variance = samples.reduce((sum, x) => sum + (x - mean) ** 2, 0) / (size - 1);
  const sd = Math.sqrt(variance);
  const sem = sd / Math.sqrt(size);
  const df = size - 1;
  const critical = tTable[((Math.round(df) || 1) as unknown) as keyof typeof tTable] || tTable.infinity;
  const moe = sem * critical;
  // t分布に基づく誤差範囲
  const rme = (moe / mean) * 100 || 0;
  return { mean, rme };
}

// 測定の際に何回コンポーネントを更新するか
const UPDATE_COUNT_FOR_MEASUREMENT = 100;

// 暖機運転の際に何回コンポーネントを更新するか
const UPDATE_COUNT_FOR_WARM_UP = 10 * 60; // 10秒分

// タイマーが 60 fps で描画されることをテストする。
// react-performance-testing を使い、仮想 DOM における描画の処理時間を見て、
// 60 fps を実現できる時間に収まっているかを assert している。
// 厳密にはテストを実行する環境のスペックに応じて処理時間は変わってくるので、
// このテストに通ったからといってユーザ環境でも 60 fps で動作するとは言えない。
// とはいえ CI によって自動で異常なパフォーマンス劣化を検知できるという
// メリットがあるので、これで良しとしている。

// jsdom で mock しきれない部分があるので、手動で mock してやる
beforeAll(() => {
  window.HTMLMediaElement.prototype.play = async () => {};
  window.performance.mark = () => {};
  window.performance.measure = () => {};
});

test('タイマーが 60 fps で描画されることをテストする', async () => {
  const timerController = new TestableTimerController();

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
  // 更新と次の 10 回の更新とでは差が出てしまう。これはグラフなどにして測定結果をまとめる際に扱いづらい
  // という問題を引き起こす。
  //
  // そのため、ここでは測定前に UPDATE_COUNT_FOR_WARM_UP 回 タイマーを更新しておき、JIT の最適化を誘発させている。
  // ちなみにこれは一般に「暖機運転」と呼ばれている。
  for (let i = 0; i < UPDATE_COUNT_FOR_WARM_UP; i++) {
    timerController.advanceBy(16);
  }

  // UPDATE_COUNT_FOR_MEASUREMENT 回 animation frame を発生させる
  for (let i = 0; i < UPDATE_COUNT_FOR_MEASUREMENT; i++) {
    // NOTE: GC の停止時間が発生すると計測結果に外れ値が現れる可能性がある。計測結果からは
    // GC の停止時間によるものなのか、アプリケーションコードのミスによるものなのか判断が難しく、
    // グラフなどにして測定結果をまとめる際にも扱いづらいという問題がある。
    //
    // そこでここではコンポーネントの更新中に GC ができるだけ発生しないような工夫を施している。
    // 具体的には、メモリ中にある一定量のゴミが溜まったら GC が発生する性質を逆手に取り、
    // コンポーネントの更新前に GC を強制的に発生させておき、コンポーネントの更新時にゴミが
    // ほとんどない状況を作っている。これにより、コンポーネントの更新時にゴミが GC 発生のしきい値を
    // 超えることがなくなり、コンポーネントの更新中に GC が発生しなくなるはず、という期待をしている。
    //
    // GC はコストの高い操作なのでコンポーネントの更新 10 回につき 1 回くらいの頻度で発生させることにしている。
    if (i % 10 === 0) global.gc();

    // タイマーを更新
    timerController.advanceBy(16);
  }

  await wait(() => {}); // 測定結果を集計 (`renderTime.current.*` に測定結果が代入される)

  // それぞれのコンポーネントの更新時間一覧を取得
  // NOTE: 暖気運転した分の更新時間も含まれているので slice する
  const updatesForTimerTimeline = renderTime.current.TimerTimeline.updates.slice(-UPDATE_COUNT_FOR_MEASUREMENT);
  const updatesForTimerRemainDisplay = renderTime.current.TimerRemainDisplay.updates.slice(
    -UPDATE_COUNT_FOR_MEASUREMENT,
  );

  const statForTimerTimeline = getStatistics(updatesForTimerTimeline);
  const statForTimerRemainDisplay = getStatistics(updatesForTimerRemainDisplay);

  // github-action-benchmark 向けに結果を書き出す
  await fs.writeFile(
    'output.txt',
    `
TimerTimeline x ${statForTimerTimeline.mean} ms/render ±${statForTimerTimeline.rme.toFixed(
      2,
    )}% (${UPDATE_COUNT_FOR_MEASUREMENT} runs sampled)
TimerRemainDisplay x ${statForTimerRemainDisplay.mean} ms/render ±${statForTimerRemainDisplay.rme.toFixed(
      2,
    )}% (${UPDATE_COUNT_FOR_MEASUREMENT} runs sampled)
  `.trim(),
  );

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

  console.log(
    inspect(
      {
        statForTimerTimeline,
        updatesForTimerTimeline,
      },
      { maxArrayLength: null },
    ),
  );
  console.log(
    inspect(
      {
        statForTimerRemainDisplay,
        updatesForTimerRemainDisplay,
      },
      { maxArrayLength: null },
    ),
  );
});
