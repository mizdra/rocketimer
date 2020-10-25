import { chromium } from 'playwright';
import { log } from './helper/log';
import { getStatistics, saveStatistics } from './helper/statistics';

const SITE_URL = process.env.SITE_URL ?? 'http://localhost:8080';
const DEBUG = process.env.DEBUG === '1' || false; // DEBUG=1 ならデバッグモードにする

type Measurement = {
  /** 測定開始直後のメモリ使用量 - 測定終了直前のメモリ使用量 */
  bytesDiff: number;
  /** 測定時間 (ms) */
  time: number;
  /** Bytes per second */
  bps: number;
};

/**
 * メモリ使用量を測定してその測定結果を返す。
 * `Page#evaluate` に渡すのでシリアライズ可能なよう記述している。
 * */
async function measureMemory(): Promise<Measurement[]> {
  async function wait(ms: number) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), ms);
    });
  }

  const startButton = document.querySelector<HTMLElement>('[data-testid="start-countdown-button"]')!;
  startButton.click();
  // 最初のほうはメモリ使用量が安定しないので暖機運転する
  await wait(2 * 1000);
  // 強制的にGCも発生させておく
  await performance.measureMemory!();
  // もう 1 回おまじないとしてやっておく
  await wait(2 * 1000);
  await performance.measureMemory!();

  const measurements: Measurement[] = [];
  for (let i = 0; i < 10; i++) {
    const measurement1 = await performance.measureMemory!();
    const start = performance.now();

    await wait(2 * 1000); // 2 秒間待機

    const measurement2 = await performance.measureMemory!();
    const end = performance.now();

    const bytesDiff = measurement2.bytes - measurement1.bytes;
    const time = end - start;
    const bps = bytesDiff / (time / 1000);
    measurements.push({ bytesDiff, time, bps });
  }

  return measurements;
}

void (async () => {
  const browser = await chromium.launch({
    headless: false,
    args: ['--enable-blink-features=MeasureMemory,ForceEagerMeasureMemory'],
  });
  const page = await browser.newPage();

  await page.goto(SITE_URL, { waitUntil: 'networkidle' });
  const measurements = await page.evaluate(measureMemory);
  log('measurements: ', measurements);

  const statForBytesPerSecond = getStatistics(measurements.map((measurement) => measurement.bps));

  // github-action-benchmark 向けに結果を書き出す
  await saveStatistics('カウントダウン中のメモリ使用量の変化量', 'bytes/second', statForBytesPerSecond);
  log('statForBytesPerSecond: ', statForBytesPerSecond);

  await browser.close();
})();
