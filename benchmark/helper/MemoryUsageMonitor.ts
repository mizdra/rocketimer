import { median } from './statistics';

type MeasurementDiff = {
  // name: BytesPerSecond
  'memory-usage.all': number;
  'memory-usage.breakdown.JavaScript'?: number;
  'memory-usage.breakdown.DOM'?: number;
  'memory-usage.breakdown.Shared'?: number;
  'memory-usage.breakdown.Canvas'?: number;
};

export type MeasurementWithTime = {
  time: number; // ms
  measurement: MemoryMeasurement;
};

function generateBreakdownEntryName(entry: MemoryBreakdownEntry) {
  return 'memory-usage.breakdown.' + entry.types.join('-');
}

function diffMeasurements(
  { time: start, measurement: measurement1 }: MeasurementWithTime,
  { time: end, measurement: measurement2 }: MeasurementWithTime,
): MeasurementDiff {
  const time = (end - start) / 1000;
  const result: MeasurementDiff = {
    'memory-usage.all': (measurement2.bytes - measurement1.bytes) / time,
  };
  measurement1.breakdown.forEach((entry1) => {
    const name = generateBreakdownEntryName(entry1);
    const entry2 = measurement2.breakdown.find((entry) => generateBreakdownEntryName(entry) === name);
    if (!entry2) return;
    if (
      name === 'memory-usage.breakdown.JavaScript' ||
      name === 'memory-usage.breakdown.DOM' ||
      name === 'memory-usage.breakdown.Shared' ||
      name === 'memory-usage.breakdown.Canvas'
    ) {
      result[name] = (entry2.bytes - entry1.bytes) / time;
    }
  });
  return result;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function isNumber(value: any): value is number {
  return typeof value === 'number';
}

function medianMeasurementDiffs(measurementDiffs: MeasurementDiff[]): MeasurementDiff {
  return {
    'memory-usage.all': median(measurementDiffs.map((diff) => diff['memory-usage.all'])),
    'memory-usage.breakdown.JavaScript': median(
      measurementDiffs.map((diff) => diff['memory-usage.breakdown.JavaScript']).filter(isNumber),
    ),
    'memory-usage.breakdown.DOM': median(
      measurementDiffs.map((diff) => diff['memory-usage.breakdown.DOM']).filter(isNumber),
    ),
    'memory-usage.breakdown.Shared': median(
      measurementDiffs.map((diff) => diff['memory-usage.breakdown.Shared']).filter(isNumber),
    ),
    'memory-usage.breakdown.Canvas': median(
      measurementDiffs.map((diff) => diff['memory-usage.breakdown.Canvas']).filter(isNumber),
    ),
  };
}

export function generateReport(measurementWithTimes: MeasurementWithTime[]): MeasurementDiff {
  const measurementDiffs = [];
  for (let i = 0; i < measurementWithTimes.length - 1; i++) {
    const measurementWithTime1 = measurementWithTimes[i];
    const measurementWithTime2 = measurementWithTimes[i + 1];
    const diff = diffMeasurements(measurementWithTime1, measurementWithTime2);
    measurementDiffs.push(diff);
  }
  return medianMeasurementDiffs(measurementDiffs);
}

/**
 * @param time エポック秒
 */
export function printReportForMackerel(time: number, report: MeasurementDiff): void {
  for (const [name, value] of Object.entries(report)) {
    console.log(`${name} ${value} ${time}`);
  }
}
