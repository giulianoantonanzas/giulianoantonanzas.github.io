// Regenerates the derived assets from the sources in this repo:
//   assets/og.png                      <- tools/og.html        (share image, 1200x630)
//   assets/apple-touch-icon.png        <- assets/favicon.svg   (180x180)
//   assets/cv-giuliano-antonanzas-*.pdf <- cv.html             (A4, es + en)
// Usage: node tools/build-assets.js   (needs playwright with chromium installed)
const path = require('path');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const file = (p) => 'file://' + path.join(root, p);

(async () => {
  const browser = await chromium.launch();
  const settle = async (page) => { await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(300); };

  let page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.goto(file('tools/og.html'), { waitUntil: 'networkidle' }); await settle(page);
  await page.screenshot({ path: path.join(root, 'assets/og.png') });

  page = await browser.newPage({ viewport: { width: 180, height: 180 } });
  const svg = require('fs').readFileSync(path.join(root, 'assets/favicon.svg'), 'utf8').replace('<svg ', '<svg width="180" height="180" ');
  await page.setContent(`<body style="margin:0">${svg}</body>`);
  await page.evaluate(() => document.fonts.ready); await page.waitForTimeout(300);
  await page.screenshot({ path: path.join(root, 'assets/apple-touch-icon.png'), omitBackground: true });

  for (const lang of ['es', 'en']) {
    page = await browser.newPage({ viewport: { width: 900, height: 1200 } });
    await page.goto(file('cv.html') + '?lang=' + lang, { waitUntil: 'networkidle' }); await settle(page);
    await page.emulateMedia({ media: 'print' });
    await page.pdf({ path: path.join(root, `assets/cv-giuliano-antonanzas-${lang}.pdf`), format: 'A4', printBackground: true, preferCSSPageSize: true });
  }
  await browser.close();
  console.log('assets regenerated');
})();
