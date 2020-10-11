import { chromium } from 'playwright';

const SITE_URL = process.env.SITE_URL ?? 'http://localhost:8080';
const DEBUG = process.env.DEBUG === '1' || false; // DEBUG=1 ならデバッグモードにする

beforeAll(async () => {});

test('should display "google" text on page', async () => {
  const browser = await chromium.launch({
    headless: DEBUG ? false : true,
  });
  const page = await browser.newPage();
  await page.goto('https://whatismybrowser.com/');
  const text = await page.$eval('.string-major', (el) => el.innerHTML);
  expect(text).toContain('Chrome');
  await browser.close();
});
