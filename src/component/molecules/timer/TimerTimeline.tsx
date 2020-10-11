import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import Konva from 'konva';
import { useRecoilValue } from 'recoil';
import { totalElapsedState, lapEndTimesState } from '../../../recoil/cascade-timer';
import {
  calcParamsForKonva,
  CURRENT_LINE_X,
  DAY,
  GRID_LABEL_Y,
  HORIZON_LINE_Y,
  SECOND,
  STAGE_HEIGHT,
} from '../../../lib/timeline';
import { range } from '../../../lib/array';
import useSize from '@react-hook/size';

export type TimerTimelineProps = {};

type KonvaNodes = {
  stage: Konva.Stage;
  layer2: Konva.Layer;
  gridLines: Konva.Line[];
  gridLabels: Konva.Text[];
  lapEndLines: Konva.Line[];
};

function useKonvaCanvas(ref: React.RefObject<HTMLDivElement>) {
  const totalElapsed = useRecoilValue(totalElapsedState);
  const lapEndTimes = useRecoilValue(lapEndTimesState);
  const [containerWidth, containerHeight] = useSize(ref);

  const [konvaNodes, setKonvaNodes] = useState<KonvaNodes | null>(null);
  const [zoom, setZoom] = useState<number>(7.5 * 1000);

  useEffect(() => {
    const container = ref.current;
    if (container === null) return;

    // stage
    const stage = new Konva.Stage({
      container,
      // containerWidth / containerHeight はコンテナのボーダーのサイズ含んでおり、
      // それを stage のサイズに使ってしまうと stage がコンテナのボーダーと重なってしまうので
      // container.clientWidth / container.clientHeight を使う
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

    stage.children.each((layer) => {
      layer.children.each((node) => {
        if (node instanceof Konva.Shape) {
          node.transformsEnabled('position');
          node.hitStrokeWidth(0);
          node.shadowForStrokeEnabled(false);
          node.perfectDrawEnabled(false);
          node.listening(false);
        }
      });
      layer.listening(false);
    });
    stage.listening(false);

    setKonvaNodes({ stage, layer2, gridLines, gridLabels, lapEndLines });

    stage.on('wheel', (e) => {
      e.evt.preventDefault();
      setZoom((oldZoom) => {
        // !!! The following code is copied from konva.js !!!
        // this code is lisenced by LICENSE.KONVA
        let delta = 0;
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
        const wheelDelta = (e.evt as any).wheelDelta as number;
        if (wheelDelta) {
          /* IE/Opera. */
          delta = wheelDelta / 120;
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
  }, [lapEndTimes, ref, containerWidth, containerHeight]);

  // タイムラインはリアルタイム性が求められるので useLayoutEffect を使う
  useLayoutEffect(() => {
    if (!konvaNodes) return;
    const { stage, layer2, gridLines, gridLabels, lapEndLines } = konvaNodes;
    if (process.env.NODE_ENV !== 'production') {
      performance.mark('draw:start');
    }
    const stageWidth = stage.width();

    const { gridParamsList, lapEndParamsList } = calcParamsForKonva(stageWidth, zoom, totalElapsed, lapEndTimes);

    gridLines.forEach((gridLine, i) => {
      const gridLabel = gridLabels[i];
      if (i < gridParamsList.length) {
        const gridParams = gridParamsList[i];
        gridLine.show();
        gridLabel.show();
        gridLine.x(gridParams.line.x);
        gridLabel.x(gridParams.label.x);
        gridLabel.text(gridParams.label.text);
      } else {
        gridLine.hide();
        gridLabel.hide();
      }
    });
    lapEndLines.forEach((lapEndLine, i) => {
      if (i < lapEndParamsList.length) {
        const lapEndParams = lapEndParamsList[i];
        lapEndLine.show();
        lapEndLine.x(lapEndParams.x);
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
  }, [lapEndTimes, totalElapsed, zoom, konvaNodes]);
}

export function TimerTimeline() {
  const ref = useRef<HTMLDivElement>(null);
  useKonvaCanvas(ref);
  return (
    <div style={{ background: '#fff', border: '1px solid #bfbfbf', width: '100%', height: STAGE_HEIGHT }} ref={ref} />
  );
}
