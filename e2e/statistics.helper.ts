import { promises as fs } from 'fs';

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

type Statistics = {
  mean: number;
  rme: number;
  size: number;
};

/** 平均値と t 分布に基づく 95% 信頼区間を返す */
export function getStatistics(samples: number[]) {
  const size = samples.length;
  // 更新時間の平均
  const mean = samples.reduce((a, b) => a + b, 0) / size;
  const variance = samples.reduce((sum, x) => sum + (x - mean) ** 2, 0) / (size - 1);
  const sd = Math.sqrt(variance);
  const sem = sd / Math.sqrt(size);
  const df = size - 1;
  const critical = tTable[((Math.round(df) || 1) as unknown) as keyof typeof tTable] || tTable.infinity;
  const moe = sem * critical;
  // t 分布に基づく 95% 信頼区間
  const rme = (moe / mean) * 100 || 0;
  return { mean, rme, size };
}

/** github-action-benchmark 向けに結果を書き出す */
export async function saveStatistics(name: string, unit: string, statistics: Statistics) {
  await fs.appendFile(
    'output.txt',
    `
${name} x ${statistics.mean} ${unit} ±${statistics.rme.toFixed(2)}% (${statistics.size} runs sampled)
  `.trim() + '\n',
  );
}
