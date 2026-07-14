const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-gl=swiftshader'] });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  const allMessages = [];
  
  page.on('console', msg => {
    allMessages.push(`[${msg.type().toUpperCase()}] ${msg.text()}`);
  });

  console.log('Loading...');
  await page.goto('https://maximeallanic.github.io/solar-system-3d-1783944049/', { waitUntil: 'networkidle', timeout: 30000 });
  
  // Wait longer for Three.js to actually boot
  console.log('Waiting 5s for Three.js initialization...');
  await page.waitForTimeout(5000);

  // Check if loading screen is gone
  const loadingGone = await page.evaluate(() => {
    const overlay = document.querySelector('[style*="z-index:1000"]');
    if (!overlay) return true; // Gone
    const opacity = getComputedStyle(overlay).opacity;
    return parseFloat(opacity) < 0.1;
  });

  console.log('Loading screen gone:', loadingGone);

  // Check for scene content
  const sceneState = await page.evaluate(() => {
    const canvas = document.querySelector('canvas');
    if (!canvas) return { error: 'No canvas' };
    
    // Try to read pixel data
    const ctx = canvas.getContext('webgl') || canvas.getContext('webgl2') || canvas.getContext('2d');
    if (!ctx) return { error: 'No GL context' };
    
    return {
      canvasSize: `${canvas.width}x${canvas.height}`,
      contextType: ctx.constructor.name,
      hasPrimitive: !!ctx.clear // Basic GL fn
    };
  });

  console.log('Scene state:', sceneState);

  // Print all console messages
  console.log('\n=== ALL CONSOLE MESSAGES ===');
  if (allMessages.length === 0) {
    console.log('(none)');
  } else {
    allMessages.forEach(m => console.log(m));
  }

  // Check React fiber
  const reactState = await page.evaluate(() => {
    const root = document.getElementById('__next');
    return {
      rootExists: !!root,
      rootChildren: root?.childNodes.length || 0,
      rootHTML: root?.innerHTML?.substring(0, 200) || 'empty'
    };
  });

  console.log('\n=== REACT ROOT ===');
  console.log(JSON.stringify(reactState, null, 2));

  // Take screenshot
  await page.screenshot({ path: '/tmp/render-state.png', fullPage: false });
  console.log('\nScreenshot: /tmp/render-state.png');

  await browser.close();
})();
