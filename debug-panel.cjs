const { chromium } = require('playwright');

const URL = 'https://maximeallanic.github.io/solar-system-3d-1783944049/';

(async () => {
  const browser = await chromium.launch({ 
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-gl=swiftshader']
  });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2500);

  // Open Mercury panel
  await page.keyboard.press('1');
  await page.waitForTimeout(600);

  // Get full HTML of panel
  const panelHTML = await page.evaluate(() => {
    const panel = document.querySelector('[role="dialog"]');
    return panel ? panel.innerHTML : 'No panel found';
  });

  console.log('Panel HTML:');
  console.log(panelHTML);

  // Also get all text content
  const allText = await page.evaluate(() => {
    const panel = document.querySelector('[role="dialog"]');
    return panel ? panel.innerText : 'No panel';
  });

  console.log('\n\nPanel full text:');
  console.log(allText);

  await browser.close();
})();
