const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-gl=swiftshader'] });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  const errors = [];
  const warnings = [];
  
  page.on('console', msg => {
    const text = msg.text();
    if (msg.type() === 'error') errors.push(text);
    if (msg.type() === 'warn') warnings.push(text);
  });
  page.on('response', resp => {
    if (resp.status() >= 400) console.log(`${resp.status()} ${resp.url()}`);
  });

  console.log('Loading live URL...');
  await page.goto('https://maximeallanic.github.io/solar-system-3d-1783944049/', { waitUntil: 'networkidle', timeout: 30000 });
  
  // Wait for potential errors to surface
  await page.waitForTimeout(3000);

  // Check canvas state
  const canvasState = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    return {
      exists: !!canvas,
      width: canvas?.width,
      height: canvas?.height,
      hasPixels: canvas && (canvas.width > 0 && canvas.height > 0)
    };
  });

  console.log('\n=== CONSOLE ERRORS ===');
  if (errors.length === 0) {
    console.log('NONE');
  } else {
    errors.forEach((e, i) => console.log(`${i+1}. ${e}`));
  }

  console.log('\n=== CANVAS STATE ===');
  console.log(JSON.stringify(canvasState, null, 2));

  console.log('\n=== PAGE CONTENT ===');
  const content = await page.content();
  if (content.includes('Loading')) console.log('Loading spinner present');
  if (content.includes('Three')) console.log('Three.js references found');

  // Try to access Three via window
  const threeState = await page.evaluate(() => {
    return {
      windowThree: typeof window.THREE,
      hasCanvas: !!document.querySelector('canvas'),
      documentReady: document.readyState,
    };
  });
  console.log('\n=== INITIALIZATION STATE ===');
  console.log(JSON.stringify(threeState, null, 2));

  // Screenshot
  await page.screenshot({ path: '/tmp/live-error-state.png' });

  await browser.close();
})();
