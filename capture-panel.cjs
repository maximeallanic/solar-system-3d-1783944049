const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-gl=swiftshader'] });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  await page.goto('https://maximeallanic.github.io/solar-system-3d-1783944049/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(3000);

  // Open info panel
  await page.keyboard.press('3'); // Earth
  await page.waitForTimeout(800);

  await page.screenshot({ path: '/home/agent/workspace/solar-system-3d/panel-screenshot.png' });
  console.log('Panel screenshot saved');
  
  await browser.close();
})();
