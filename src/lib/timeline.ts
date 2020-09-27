const DAY = 1000 * 60 * 60 * 24;
const HOUR = 1000 * 60 * 60;
const MINUTE = 1000 * 60;
const SECOND = 1000;

export const STAGE_HEIGHT: Px = 56;
export const HORIZON_LINE_Y: Px = STAGE_HEIGHT - 26;
export const CURRENT_LINE_X: Px = 40;
export const GRID_LABEL_Y: Px = HORIZON_LINE_Y + 8;
export const FACTOR = 10; // px / ms

export type Px = number; // pixel
export type Ms = number; // milli seconds

export type Grid = {
  time: Ms;
  lineX: Px;
  labelX: Px;
  labelText: string;
};

export type LapEndLine = {
  time: Ms;
  x: Px;
};

export type ScaleConfig = {
  msByPx: number;
  gridStepUnit: 'day' | 'hour' | 'minute' | 'second';
  gridStepTime: Ms;
};

function calcScaleConfig(zoom: Ms): ScaleConfig {
  const msByPx = zoom / 225;
  if (zoom >= DAY) return { msByPx, gridStepUnit: 'day', gridStepTime: 1 * DAY };
  if (zoom >= HOUR * 4) return { msByPx, gridStepUnit: 'hour', gridStepTime: 4 * HOUR };
  if (zoom >= HOUR) return { msByPx, gridStepUnit: 'hour', gridStepTime: 1 * HOUR };
  if (zoom >= MINUTE * 15) return { msByPx, gridStepUnit: 'minute', gridStepTime: 15 * MINUTE };
  if (zoom >= MINUTE * 10) return { msByPx, gridStepUnit: 'minute', gridStepTime: 10 * MINUTE };
  if (zoom >= MINUTE * 5) return { msByPx, gridStepUnit: 'minute', gridStepTime: 5 * MINUTE };
  if (zoom >= MINUTE) return { msByPx, gridStepUnit: 'minute', gridStepTime: 1 * MINUTE };
  if (zoom >= SECOND * 15) return { msByPx, gridStepUnit: 'second', gridStepTime: 15 * SECOND };
  if (zoom >= SECOND * 10) return { msByPx, gridStepUnit: 'second', gridStepTime: 10 * SECOND };
  if (zoom >= SECOND * 5) return { msByPx, gridStepUnit: 'second', gridStepTime: 5 * SECOND }; // default (5000 <= zoom < 10000)
  return { msByPx, gridStepUnit: 'second', gridStepTime: 1 * SECOND };
}

function calcGridLabel(gridStepUnit: string, gridLineTime: Ms): string {
  if (gridStepUnit == 'day') return (Math.round(gridLineTime / DAY) % 100) + 'd';
  if (gridStepUnit == 'hour') return (Math.round(gridLineTime / HOUR) % 100) + 'h';
  if (gridStepUnit == 'minute') return (Math.round(gridLineTime / MINUTE) % 60) + 'm';
  return (Math.round(gridLineTime / SECOND) % 60) + 's';
}

function calcRangeConfig(msByPx: number, elapsed: Ms, stageWidth: Px): { minTime: Ms; maxTime: Ms } {
  const minTime = elapsed - CURRENT_LINE_X * msByPx;
  const maxTime = minTime + stageWidth * msByPx;
  return { minTime, maxTime };
}

export function calcFloatingObjects(stageWidth: Px, zoom: Ms, elapsed: Ms, lapEndTimes: number[]) {
  const { msByPx, gridStepUnit, gridStepTime } = calcScaleConfig(zoom);
  const { minTime, maxTime } = calcRangeConfig(msByPx, elapsed, stageWidth);
  const minGridLineTime = Math.floor(minTime / gridStepTime) * gridStepTime;

  function timeToX(time: Ms) {
    return CURRENT_LINE_X + (time - elapsed) / msByPx;
  }

  const grids: Grid[] = [];
  for (let gridLineTime = minGridLineTime; gridLineTime <= maxTime; gridLineTime += gridStepTime) {
    const lineX = timeToX(gridLineTime);
    grids.push({
      time: gridLineTime,
      labelText: calcGridLabel(gridStepUnit, gridLineTime),
      lineX: lineX,
      labelX: lineX + 5,
    });
  }

  const lapEndLines = lapEndTimes
    .filter((lapEndTime) => minTime <= lapEndTime && lapEndTime <= maxTime)
    .map((lapEndTime) => ({ time: lapEndTime, x: timeToX(lapEndTime) }));
  return { grids, lapEndLines };
}
