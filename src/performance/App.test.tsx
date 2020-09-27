import React from 'react';
import { perf, wait } from 'react-performance-testing';
import { render, fireEvent, screen } from '@testing-library/react';
import 'jest-performance-testing';
import { App } from '../App';
import { RecoilRoot } from 'recoil';
import { TestableTimerController } from '../lib/timer/timer-controller';

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
    expect(renderTime.current.TimerTimeline).toBeUpdatedWithin(4);
    expect(renderTime.current.TimerRemainDisplay).toBeUpdatedWithin(4);
  });
});
