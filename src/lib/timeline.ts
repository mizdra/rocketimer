export const DAY = 1000 * 60 * 60 * 24;
export const HOUR = 1000 * 60 * 60;
export const MINUTE = 1000 * 60;
export const SECOND = 1000;

export const STAGE_HEIGHT: Px = 56;
export const HORIZON_LINE_Y: Px = STAGE_HEIGHT - 26;
export const CURRENT_LINE_X: Px = 40;
export const GRID_LABEL_Y: Px = HORIZON_LINE_Y + 8;

export type Px = number; // pixel
export type Ms = number; // milli seconds

export type TimelineScale = {
  msByPx: number;
  gridStepUnit: 'day' | 'hour' | 'minute' | 'second';
  gridStepTime: Ms;
};

export type TimelineRange = { minTime: Ms; maxTime: Ms };

function calcTimelineScale(zoom: Ms): TimelineScale {
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
  if (zoom >= SECOND * 5) return { msByPx, gridStepUnit: 'second', gridStepTime: 5 * SECOND };
  return { msByPx, gridStepUnit: 'second', gridStepTime: 1 * SECOND };
}

function calcTimelineRange(msByPx: number, elapsed: Ms, stageWidth: Px): TimelineRange {
  const minTime = elapsed - CURRENT_LINE_X * msByPx;
  const maxTime = minTime + stageWidth * msByPx;
  return { minTime, maxTime };
}

function calcGridTime(minTime: number, maxTime: number, gridStepTime: number): Ms[] {
  const minGridLineTime = Math.floor(minTime / gridStepTime) * gridStepTime;

  const grids: Ms[] = [];
  for (let gridLineTime = minGridLineTime; gridLineTime <= maxTime; gridLineTime += gridStepTime) {
    grids.push(gridLineTime);
  }
  return grids;
}

function calcLadEndLineTime(minTime: number, maxTime: number, lapEndTimes: number[]): Ms[] {
  const lapEndLines: Ms[] = lapEndTimes.filter((lapEndTime) => minTime <= lapEndTime && lapEndTime <= maxTime);
  return lapEndLines;
}

function calcGridLabel(gridStepUnit: string, gridLineTime: Ms): string {
  if (gridStepUnit == 'day') return ((gridLineTime / DAY) % 100) + 'd';
  if (gridStepUnit == 'hour') return ((gridLineTime / HOUR) % 100) + 'h';
  if (gridStepUnit == 'minute') return ((gridLineTime / MINUTE) % 60) + 'm';
  return ((gridLineTime / SECOND) % 60) + 's';
}

function timeToX(msByPx: number, elapsed: Ms, time: Ms) {
  return CURRENT_LINE_X + (time - elapsed) / msByPx;
}

function calcGridParamsForKonva(msByPx: number, elapsed: number, gridStepUnit: string, gridTime: Ms) {
  return {
    line: {
      x: timeToX(msByPx, elapsed, gridTime),
    },
    label: {
      x: timeToX(msByPx, elapsed, gridTime) + 5,
      text: calcGridLabel(gridStepUnit, gridTime),
    },
  };
}

function calcLapEndParamsForKonva(msByPx: number, elapsed: number, lapEndLineTime: Ms) {
  return {
    x: timeToX(msByPx, elapsed, lapEndLineTime),
  };
}

export function calcParamsForKonva(stageWidth: Px, zoom: number, elapsed: Ms, lapEndTimes: Ms[]) {
  const { msByPx, gridStepUnit, gridStepTime } = calcTimelineScale(zoom);
  const { minTime, maxTime } = calcTimelineRange(msByPx, elapsed, stageWidth);

  const gridTimes = calcGridTime(minTime, maxTime, gridStepTime);
  const lapEndLineTimes = calcLadEndLineTime(minTime, maxTime, lapEndTimes);

  const gridParamsList = gridTimes.map((gridTime) => calcGridParamsForKonva(msByPx, elapsed, gridStepUnit, gridTime));
  const lapEndParamsList = lapEndLineTimes.map((lapEndLineTime) =>
    calcLapEndParamsForKonva(msByPx, elapsed, lapEndLineTime),
  );
  return { gridParamsList, lapEndParamsList };
}
