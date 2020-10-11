import { chromium } from 'playwright';

const SITE_URL = process.env.SITE_URL ?? 'http://localhost:8080';
const DEBUG = process.env.DEBUG === '1' || false; // DEBUG=1 ならデバッグモードにする

test('Autoplay Policy に引っかからない', async () => {
  const browser = await chromium.launch({
    headless: DEBUG ? false : true,
  });
  const page = await browser.newPage();
  await page.goto(SITE_URL, { waitUntil: 'networkidle' });

  const failured = await page.evaluate(async () => {
    return new Promise<boolean>((resolve) => {
      window.addEventListener('play-success', (event: CustomEvent) => {
        resolve(false);
      });
      window.addEventListener('play-failure', (event: CustomEvent) => {
        console.error(event.detail);
        resolve(true);
      });

      const startButton = document.querySelector<HTMLElement>('[data-testid="start-countdown-button"]')!;
      startButton.click();
    });
  });

  expect(failured).toBe(false);
  await browser.close();
});
