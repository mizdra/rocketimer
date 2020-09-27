import React, { useEffect, useRef, useState } from 'react';
import Konva from 'konva';
import { useRecoilValue } from 'recoil';
import { totalElapsedState, lapEndTimesState } from '../../../recoil/cascade-timer';
import {
  calcGridLabel,
  calcGridTime,
  calcLadEndLineTime,
  calcTimelineRange,
  calcTimelineScale,
  CURRENT_LINE_X,
  DAY,
  GRID_LABEL_Y,
  HORIZON_LINE_Y,
  SECOND,
  STAGE_HEIGHT,
  timeToX,
} from '../../../lib/timeline';
import { range } from '../../../lib/array';

export type TimerTimelineProps = {};

type Lines = {
  gridLines: Konva.Line[];
  gridLabels: Konva.Text[];
  lapEndLines: Konva.Line[];
};

function useKonvaCanvas(ref: React.RefObject<HTMLDivElement>) {
  const totalElapsed = useRecoilValue(totalElapsedState);
  const lapEndTimes = useRecoilValue(lapEndTimesState);

  const [lines, setLines] = useState<Lines | null>(null);
  const [stage, setStage] = useState<Konva.Stage | null>(null);
  const [layer2, setLayer2] = useState<Konva.Layer | null>(null);
  const [zoom, setZoom] = useState<number>(7.5 * 1000);

  useEffect(() => {
    const container = ref.current;
    if (container === null) return;

    // stage
    const stage = new Konva.Stage({
      container,
      width: container.clientWidth,
      height: container.clientHeight,
    });
    const stageWidth = stage.width();

    const layer1 = new Konva.Layer();
    const layer2 = new Konva.Layer();
    const layer3 = new Konva.Layer();

    // xAsis
    const xAxis = new Konva.Line({
      stroke: '#bfbfbf',
      strokeWidth: 1,
      points: [0, HORIZON_LINE_Y, stageWidth, HORIZON_LINE_Y],
    });
    layer1.add(xAxis);

    // currentTimeBar
    const currentTimeBar = new Konva.Line({
      stroke: 'orange',
      strokeWidth: 2,
      points: [CURRENT_LINE_X, 0, CURRENT_LINE_X, STAGE_HEIGHT],
    });
    layer3.add(currentTimeBar);

    // パフォーマンスの都合上 30 本までとする
    const gridLines = range(0, 30).map(
      () =>
        new Konva.Line({
          stroke: '#e5e5e5',
          strokeWidth: 1,
          points: [0, 0, 0, STAGE_HEIGHT],
        }),
    );
    layer2.add(...gridLines);

    // パフォーマンスの都合上 30 個までとする
    const gridLabels = range(0, 30).map(
      () =>
        new Konva.Text({
          fill: '#666',
          fontSize: 14,
          fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
          x: 0,
          y: GRID_LABEL_Y,
        }),
    );
    layer2.add(...gridLabels);

    // パフォーマンスの都合上 30 本までとする
    const lapEndLines = range(0, 30).map(() => {
      return new Konva.Line({
        stroke: '#6e94ff',
        strokeWidth: 2,
        points: [0, 0, 0, STAGE_HEIGHT],
      });
    });
    layer2.add(...lapEndLines);

    stage.add(layer1);
    stage.add(layer2);
    stage.add(layer3);

    setStage(stage);
    setLayer2(layer2);
    setLines({ gridLines, gridLabels, lapEndLines });

    stage.on('wheel', (e) => {
      e.evt.preventDefault();
      setZoom((oldZoom) => {
        // !!! The following code is copied from konva.js !!!
        // this code is lisenced by LICENSE.KONVA
        let delta = 0;
        if ((e.evt as any).wheelDelta) {
          /* IE/Opera. */
          delta = (e.evt as any).wheelDelta / 120;
        } else if (e.evt.detail) {
          /* Mozilla case. */
          // In Mozilla, sign of delta is different than in IE.
          // Also, delta is multiple of 3.
          delta = -e.evt.detail / 3;
        } else if (e.evt.deltaY) {
          delta = -e.evt.deltaY / 3;
        }
        // zoom が小さい時は小さい変化幅、大きい時は大きい変化幅になるよう、oldZoom を掛ける
        const zoomDelta = -delta * 0.1 * oldZoom;
        const newZoom = oldZoom + zoomDelta;
        return Math.max(1 * SECOND, Math.min(newZoom, 2 * DAY));
      });
    });

    return () => {
      stage.destroy();
    };
  }, [lapEndTimes, ref]);

  // TODO(performance): useLayoutEffect を使う
  useEffect(() => {
    if (!lines || !stage || !layer2) return;
    if (process.env.NODE_ENV !== 'production') {
      performance.mark('draw:start');
    }
    const { gridLines, gridLabels, lapEndLines } = lines;
    const stageWidth = stage.width();

    const scale = calcTimelineScale(zoom);
    const range = calcTimelineRange(scale.msByPx, totalElapsed, stageWidth);

    const gridTimes = calcGridTime(range.minTime, range.maxTime, scale.gridStepTime);
    const lapEndLineTimes = calcLadEndLineTime(range.minTime, range.maxTime, lapEndTimes);

    gridLines.forEach((gridLine, i) => {
      const gridLabel = gridLabels[i];
      const gridTime = gridTimes[i];
      if (gridTime !== undefined) {
        gridLine.show();
        gridLabel.show();
        gridLine.x(timeToX(scale.msByPx, totalElapsed, gridTime));
        gridLabel.x(timeToX(scale.msByPx, totalElapsed, gridTime) + 5);
        gridLabel.text(calcGridLabel(scale.gridStepUnit, gridTime));
      } else {
        gridLine.hide();
        gridLabel.hide();
      }
    });
    lapEndLines.forEach((lapEndLine, i) => {
      if (i < lapEndLineTimes.length) {
        lapEndLine.show();
        lapEndLine.x(timeToX(scale.msByPx, totalElapsed, lapEndLineTimes[i]));
      } else {
        lapEndLine.hide();
      }
    });

    // wheel イベントによって任意のタイミングで effect が呼び出される可能性があるので、
    // 念の為 batchDraw しておく
    layer2.batchDraw();
    if (process.env.NODE_ENV !== 'production') {
      performance.mark('draw:end');
      performance.measure('draw', 'draw:start', 'draw:end');
    }
  }, [lines, lapEndTimes, layer2, stage, totalElapsed, zoom]);
}

export function TimerTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  useKonvaCanvas(ref);
  return (
    <div style={{ background: '#fff', border: '1px solid #bfbfbf', width: '100%', height: STAGE_HEIGHT }} ref={ref} />
  );
}
