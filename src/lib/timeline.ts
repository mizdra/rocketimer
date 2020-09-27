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

export type GridConfig = {
  unit: 'day' | 'hour' | 'minute' | 'second';
  value: Ms;
};

function calcGridConfig(zoom: Ms): GridConfig {
  if (zoom >= DAY) return { unit: 'day', value: 1 * DAY };
  if (zoom >= HOUR * 4) return { unit: 'hour', value: 4 * HOUR };
  if (zoom >= HOUR) return { unit: 'hour', value: 1 * HOUR };
  if (zoom >= MINUTE * 15) return { unit: 'minute', value: 15 * MINUTE };
  if (zoom >= MINUTE * 10) return { unit: 'minute', value: 10 * MINUTE };
  if (zoom >= MINUTE * 5) return { unit: 'minute', value: 5 * MINUTE };
  if (zoom >= MINUTE) return { unit: 'minute', value: 1 * MINUTE };
  if (zoom >= SECOND * 15) return { unit: 'second', value: 15 * SECOND };
  if (zoom >= SECOND * 10) return { unit: 'second', value: 10 * SECOND };
  if (zoom >= SECOND * 5) return { unit: 'second', value: 5 * SECOND }; // default (5000 <= zoom < 10000)
  return { unit: 'second', value: 1 * SECOND };
}

function calcGridLabel(gridConfig: GridConfig, gridLineTime: Ms): string {
  if (gridConfig.unit == 'day') return (Math.round(gridLineTime / DAY) % 100) + 'd';
  if (gridConfig.unit == 'hour') return (Math.round(gridLineTime / HOUR) % 100) + 'h';
  if (gridConfig.unit == 'minute') return (Math.round(gridLineTime / MINUTE) % 60) + 'm';
  return (Math.round(gridLineTime / SECOND) % 60) + 's';
}

function calcRangeConfig(zoom: Ms, elapsed: Ms, stageWidth: Px): { minTime: Ms; maxTime: Ms } {
  const msByPx = 225 / zoom;
  const minTime = elapsed - CURRENT_LINE_X / msByPx;
  const maxTime = minTime + stageWidth / msByPx;
  return { minTime, maxTime };
}

// zoom default: 5000
function toPx(zoom: number, ms: Ms): Px {
  const msByPx = 225 / zoom;
  return ms * msByPx;
}

export function calcFloatingObjects(stageWidth: Px, zoom: Ms, elapsed: Ms, lapEndTimes: number[]) {
  const gridConfig = calcGridConfig(zoom); // step: 10s
  const { minTime, maxTime } = calcRangeConfig(zoom, elapsed, stageWidth); // 20s, 60s
  const minGridLineTime = Math.floor(minTime / gridConfig.value) * gridConfig.value;

  const grids: Grid[] = [];
  for (let gridLineTime = minGridLineTime; gridLineTime <= maxTime; gridLineTime += gridConfig.value) {
    const lineX = CURRENT_LINE_X + toPx(zoom, gridLineTime - elapsed);
    grids.push({
      time: gridLineTime,
      labelText: calcGridLabel(gridConfig, gridLineTime),
      lineX: lineX,
      labelX: lineX + 5,
    });
  }

  const lapEndLines = lapEndTimes
    .filter((lapEndTime) => minTime <= lapEndTime && lapEndTime <= maxTime)
    .map((lapEndTime) => ({ time: lapEndTime, x: CURRENT_LINE_X + toPx(zoom, lapEndTime - elapsed) }));
  return { grids, lapEndLines };
}
