import React from 'react';
import { perf, wait } from 'react-performance-testing';
import { render, fireEvent, screen } from '@testing-library/react';
import 'jest-performance-testing';
import { App } from '../App';
import { RecoilRoot } from 'recoil';
import { TestableTimerController } from '../lib/timer/timer-controller';

beforeAll(() => {
  window.HTMLMediaElement.prototype.play = async () => {};
  window.performance.mark = () => {};
  window.performance.measure = () => {};
});

test('should measure re-render time when state is updated with multiple of the same component', async () => {
  const { renderTime } = perf<{ TimerTimeline: unknown; TimerRemainDisplay: unknown }>(React);
  const now = Date.now();
  const timerController = new TestableTimerController(now);

  render(
    <RecoilRoot>
      <App timerController={timerController} />
    </RecoilRoot>,
  );

  // カウントダウンを開始させる
  fireEvent.click(screen.getByTestId('start-countdown-button'));

  // 500 回 animation frame を発生させる
  // NOTE: 500 回としているのは GC による停止時間を更新時間に折り込みたいため
  // TODO: GC が 少なくとも数回発生していることを assert する
  for (let i = 1; i <= 500; i++) {
    timerController.advanceTo(now + i);
  }

  await wait(() => {
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
    expect(renderTime.current.TimerTimeline).toBeUpdatedWithin(8);
    expect(renderTime.current.TimerRemainDisplay).toBeUpdatedWithin(8);
  });
});
