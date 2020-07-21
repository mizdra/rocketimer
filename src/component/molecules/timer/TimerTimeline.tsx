import React, { useRef, useEffect, useState } from 'react';
import { Timeline, TimelineOptions } from 'vis-timeline/esnext';
import { useRecoilValue } from 'recoil';
import { totalElapsedState, lapEndTimesState } from '../../../recoil/cascade-timer';

const TIMELINE_OPTIONS: TimelineOptions = {
  // 初回は 0 〜 30秒の区間を表示する
  start: 0,
  end: 30 * 1000,
  format: {
    minorLabels: {
      second: 's[s]',
      minute: 'm[m]',
    },
  },
  showCurrentTime: true, // ひたすら `setTimeout` が呼び出されてしまうので明示的にOFFにする
  showMajorLabels: false,
  zoomMax: 10 * 60 * 1000, // 1時間まで縮小できる
  zoomMin: 10 * 1000, // 10秒まで拡大できる
};

export function TimerTimeline() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [timeline, setTimeline] = useState<Timeline | null>(null);

  const totalElapsed = useRecoilValue(totalElapsedState);
  const lapEndTimes = useRecoilValue(lapEndTimesState);

  useEffect(() => {
    if (ref.current === null) return;

    const timeline = new Timeline(ref.current, [], TIMELINE_OPTIONS);
    lapEndTimes.forEach((lapEndTime, i) => {
      timeline.addCustomTime(lapEndTime, `lap-${i}-end-time`);
    });
    timeline.addCustomTime(0, 'elapsed');

    timeline.on('rangechange', (args: any) => {
      if (args.byUser === false) return;
      const { start, end } = timeline.getWindow();
      const totalElapsed = timeline.getCustomTime('elapsed').valueOf();
      const windowWidth = end.valueOf() - start.valueOf();
      timeline.moveTo(totalElapsed + windowWidth * 0.4, { animation: false });
    });

    setTimeline(timeline);

    return () => {
      timeline?.destroy();
    };
  }, [lapEndTimes]);

  useEffect(() => {
    if (timeline === null) return;

    // NOTE: 経過時間のマーカーを左側に表示したいが, `Timeline#moveTo` は指定された時刻を中央に表示するメソッドであるため,
    // 単に `timeline.moveTo(totalElapsed)` とすると経過時間のマーカーが中央に表示されてしまう. そのため, ここでは
    // オフセットを取って左へと寄せている.
    const { start, end } = timeline.getWindow();
    const windowWidth = end.valueOf() - start.valueOf();
    timeline.moveTo(totalElapsed + windowWidth * 0.4, { animation: false });
    timeline.setCustomTime(totalElapsed, 'elapsed');
  }, [timeline, totalElapsed]);

  return <div ref={ref} />;
}
