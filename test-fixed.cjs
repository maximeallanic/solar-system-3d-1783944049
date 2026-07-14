const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-gl=swiftshader'] });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  const errors = [];
  page.on('console', msg => {
    const text = msg.text();
    if (msg.type() === 'error' && !text.includes('GL Driver Message') && !text.includes('ReadPixels')) {
      errors.push(text);
    }
  });

  console.log('Testing fixed live URL...');
  await page.goto('https://maximeallanic.github.io/solar-system-3d-1783944049/', { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(4000);

  // Check React root
  const rootState = await page.evaluate(() => {
    const root = document.getElementById('__next');
    return {
      exists: !!root,
      childCount: root?.childNodes.length || 0,
      hasContent: root && root.innerText && root.innerText.length > 10
    };
  });

  // Check Three.js
  const sceneState = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    return {
      canvas: !!canvas,
      width: canvas?.width || 0,
      canvasChildrenCount: canvas?.parentElement?.childNodes.length || 0
    };
  });

  // Test interaction
  await page.keyboard.press('1');
  await page.waitForTimeout(600);
  
  const panelState = await page.evaluate(() => {
    const panel = document.querySelector('[role="dialog"]');
    return {
      open: !!panel,
      title: panel?.querySelector('h2')?.innerText || ''
    };
  });

  // Test drag
  await page.mouse.move(640, 400);
  await page.mouse.down();
  await page.mouse.move(700, 450, { steps: 5 });
  await page.mouse.up();

  // Screenshot
  await page.screenshot({ path: '/home/agent/workspace/solar-system-3d/fixed-render.png' });

  await browser.close();

  console.log('\n=== RESULTS ===');
  console.log('Console errors:', errors.length === 0 ? 'PASS (0)' : `FAIL (${errors.length}): ${errors[0]}`);
  console.log('React root:', rootState.exists && rootState.hasContent ? 'PASS' : 'FAIL');
  console.log('Canvas:', sceneState.canvas ? 'PASS' : 'FAIL');
  console.log('Panel click:', panelState.open ? 'PASS (Mercury opened)' : 'FAIL');
  console.log('Drag:', 'OK (no error)');
  
  const allPass = errors.length === 0 && rootState.exists && sceneState.canvas && panelState.open;
  process.exit(allPass ? 0 : 1);
})();
