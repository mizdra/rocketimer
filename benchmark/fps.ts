import { chromium } from 'playwright';
import { log } from './helper/log';
import { getStatistics, saveStatistics } from './helper/statistics';

const SITE_URL = process.env.SITE_URL ?? 'http://localhost:8080';
const DEBUG = process.env.DEBUG === '1' || false; // DEBUG=1 ならデバッグモードにする

type Measurement = {
  /** 測定中に発生した animation frame の総数 */
  frameCount: number;
  /** 測定時間 */
  time: number;
  /** FPS */
  fps: number;
};

/**
 * FPS を測定してその測定結果を返す。
 * `Page#evaluate` に渡すのでシリアライズ可能なよう記述している。
 * */
async function measureFPS() {
  class FPSMonitor {
    startTime = 0;
    frameCount = 0;
    measuring = false;
    async startMeasurement() {
      this.frameCount = 0;
      this.measuring = true;
      this.startTime = performance.now();

      async function waitRaf() {
        return new Promise((resolve) => {
          requestAnimationFrame(() => resolve());
        });
      }

      // eslint-disable-next-line no-constant-condition
      while (true) {
        await waitRaf();
        if (!this.measuring) break;
        this.frameCount++;
      }
    }
    endMeasurement(): Measurement {
      const endTime = performance.now();
      const time = endTime - this.startTime;
      this.measuring = false;
      return {
        frameCount: this.frameCount,
        time,
        fps: this.frameCount / (time / 1000),
      };
    }
  }

  async function wait(ms: number) {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), ms);
    });
  }

  const startButton = document.querySelector<HTMLElement>('[data-testid="start-countdown-button"]')!;
  const fpsMonitor = new FPSMonitor();
  fpsMonitor.startMeasurement();
  startButton.click();
  await wait(2 * 1000); // 2 秒間待機
  const count = fpsMonitor.endMeasurement();
  return count;
}

(async () => {
  const browser = await chromium.launch({
    headless: DEBUG ? false : true,
    // 60 FPS で頭打ちになるとどれくらいパフォーマンスが出るのかよく分からないので上限を取っ払う
    args: ['--disable-frame-rate-limit'],
  });
  const page = await browser.newPage();

  const measurements: Measurement[] = [];
  for (let i = 0; i < 10; i++) {
    await page.goto(SITE_URL, { waitUntil: 'networkidle' });
    const measurement = await page.evaluate(measureFPS);
    log('measurement: ', measurement);
    measurements.push(measurement);
  }

  const statForFPS = getStatistics(measurements.map((measurement) => measurement.fps));

  // github-action-benchmark 向けに結果を書き出す
  await saveStatistics('FPS during Countdowning', 'fps', statForFPS);
  log('statForFPS: ', statForFPS);

  await browser.close();
})();
