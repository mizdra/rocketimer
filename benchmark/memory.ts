import { chromium } from 'playwright';
import { generateReport, MeasurementWithTime, printReportForMackerel } from './helper/MemoryUsageMonitor';
import { log } from './helper/log';

// mackerel に送信する際に利用する現在時刻 (秒)
const time = process.env.TIME === undefined ? Math.round(Date.now() / 1000) : +process.env.TIME;

const SITE_URL = process.env.SITE_URL ?? 'http://localhost:8080';

/**
 * メモリ使用量を測定してその測定結果を返す。
 * `Page#evaluate` に渡すのでシリアライズ可能なよう記述している。
 * */
async function measureMemory(): Promise<MeasurementWithTime[]> {
  async function wait(ms: number) {
    return new Promise<void>((resolve) => {
      setTimeout(() => resolve(), ms);
    });
  }

  const startButton = document.querySelector<HTMLElement>('[data-testid="start-countdown-button"]')!;
  startButton.click();
  // 最初のほうはメモリ使用量が安定しないので暖機運転する
  await wait(50 * 1000);
  // 強制的にGCも発生させておく
  await performance.measureUserAgentSpecificMemory!();
  // もう 1 回おまじないとして待機
  await wait(50 * 1000);

  const measurementWithTimes: MeasurementWithTime[] = [];

  const measurement = await performance.measureUserAgentSpecificMemory!();
  const time = performance.now();
  measurementWithTimes.push({ time, measurement });
  for (let i = 0; i < 10; i++) {
    await wait(10 * 1000); // 10 秒間待機
    const measurement = await performance.measureUserAgentSpecificMemory!();
    const time = performance.now();
    measurementWithTimes.push({ time: time, measurement });
  }
  return measurementWithTimes;
}

void (async () => {
  const browser = await chromium.launch({
    headless: false,
    args: ['--enable-blink-features=ForceEagerMeasureMemory'],
  });
  const page = await browser.newPage();

  await page.goto(SITE_URL, { waitUntil: 'networkidle' });
  const measurementWithTimes = await page.evaluate(measureMemory);
  const report = generateReport(measurementWithTimes);

  log('measurementWithTimes: ', measurementWithTimes);
  log('report: ', report);
  printReportForMackerel(time, report);

  await browser.close();
})();
