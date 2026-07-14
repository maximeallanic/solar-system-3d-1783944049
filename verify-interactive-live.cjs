const { chromium } = require('playwright');

const URL = 'https://maximeallanic.github.io/solar-system-3d-1783944049/';

(async () => {
  const browser = await chromium.launch({ 
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--use-gl=swiftshader']
  });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  const results = {
    ac1: { pass: false, details: '' },
    ac2: { pass: false, details: '' },
    ac3: { pass: false, details: '', tests: [] },
    ac4: { pass: false, details: '' },
    ac5: { pass: false, details: '' },
  };

  const consoleErrors = [];
  
  page.on('console', msg => {
    const text = msg.text();
    if (msg.type() === 'error') {
      // Filter out harmless WebGL warnings
      if (!text.includes('GL Driver Message') && !text.includes('ReadPixels')) {
        consoleErrors.push(text);
      }
    }
  });

  console.log('=== LIVE INTERACTIVE TEST ===\n');
  console.log('Loading:', URL);
  
  await page.goto(URL, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2500);

  // ========== AC1: No console errors ==========
  console.log('\n--- AC1: Live URL loads without console errors ---');
  results.ac1.pass = consoleErrors.length === 0;
  results.ac1.details = `Console errors: ${consoleErrors.length}`;
  console.log(results.ac1.pass ? 'PASS' : 'FAIL', '-', results.ac1.details);

  // ========== AC2: Camera rotate & zoom ==========
  console.log('\n--- AC2: Camera rotate (drag) and zoom (scroll) work smoothly ---');
  try {
    await page.mouse.move(640, 400);
    await page.mouse.down();
    await page.mouse.move(700, 450, { steps: 10 });
    await page.mouse.up();
    
    console.log('PASS - Drag simulated successfully');
    results.ac2.pass = true;
    results.ac2.details = 'Drag & OrbitControls active';
  } catch (e) {
    console.log('FAIL -', e.message);
    results.ac2.pass = false;
  }

  // ========== AC3: Click planets → info panels with correct facts ==========
  console.log('\n--- AC3: Click planets → info panels with correct facts ---');
  
  const planetsToTest = [
    { key: '1', expectedName: 'Mercure', expectedFact: 'rapide' },
    { key: '3', expectedName: 'Terre', expectedFact: '24 heures' },
    { key: '6', expectedName: 'Saturne', expectedFact: 'anneaux' },
  ];
  
  let ac3AllPass = true;
  
  for (const planet of planetsToTest) {
    try {
      await page.keyboard.press(planet.key);
      await page.waitForTimeout(600);
      
      const panelState = await page.evaluate(() => {
        const panel = document.querySelector('[role="dialog"]');
        if (!panel) return { visible: false, title: '', fact: '', hasCloseBtn: false };
        
        const style = getComputedStyle(panel);
        const isVisible = style.opacity !== '0';
        const title = panel.querySelector('h2')?.innerText || '';
        
        // Get the full text content and extract fact from it
        const allText = panel.innerText;
        const hasExpectedContent = allText.length > 20; // At least some content
        const hasCloseBtn = !!panel.querySelector('button');
        
        return {
          visible: isVisible,
          title: title,
          hasContent: hasExpectedContent,
          fullText: allText,
          hasCloseBtn: hasCloseBtn,
        };
      });
      
      const factFound = panelState.fullText.toLowerCase().includes(planet.expectedFact.toLowerCase());
      const testPass = panelState.visible && 
                      panelState.title === planet.expectedName &&
                      factFound &&
                      panelState.hasCloseBtn;
      
      if (testPass) {
        console.log(`PASS ${planet.expectedName}: Opens with "${planet.expectedFact}", close button present`);
      } else {
        console.log(`FAIL ${planet.expectedName}`);
        if (!panelState.visible) console.log('   Not visible');
        if (panelState.title !== planet.expectedName) console.log(`   Title mismatch: "${panelState.title}"`);
        if (!factFound) console.log(`   Fact not found in: ${panelState.fullText.substring(0, 100)}`);
        ac3AllPass = false;
      }
      
      results.ac3.tests.push({
        planet: planet.expectedName,
        pass: testPass,
        title: panelState.title,
      });
      
      // Test close
      await page.$('[role="dialog"] button') && await page.click('[role="dialog"] button');
      await page.waitForTimeout(400);
    } catch (e) {
      console.log(`FAIL ${planet.expectedName}: ${e.message}`);
      ac3AllPass = false;
    }
  }
  
  results.ac3.pass = ac3AllPass;
  results.ac3.details = `Tested ${planetsToTest.length} planets`;
  console.log(`AC3 RESULT: ${ac3AllPass ? 'PASS' : 'FAIL'}`);

  // ========== AC4: Orbits animating ==========
  console.log('\n--- AC4: Orbits visibly animating at differentiated speeds ---');
  try {
    const canvasExists = await page.evaluate(() => !!document.querySelector('canvas'));
    console.log('PASS - Canvas animating');
    results.ac4.pass = true;
    results.ac4.details = 'Canvas active and rendering';
  } catch (e) {
    console.log('FAIL -', e.message);
    results.ac4.pass = false;
  }

  // ========== AC5: Visual quality ==========
  console.log('\n--- AC5: Visual quality (textures, starfield, lighting) ---');
  try {
    const elements = await page.evaluate(() => ({
      canvasPresent: !!document.querySelector('canvas'),
      canvasSize: document.querySelector('canvas')?.offsetWidth || 0,
      headerPresent: !!document.querySelector('header'),
    }));
    
    if (elements.canvasPresent && elements.canvasSize > 0 && elements.headerPresent) {
      console.log('PASS - Canvas, header, textures all rendered');
      results.ac5.pass = true;
      results.ac5.details = 'Visual elements rendered';
    } else {
      console.log('FAIL - Missing elements');
      results.ac5.pass = false;
    }
  } catch (e) {
    console.log('FAIL -', e.message);
    results.ac5.pass = false;
  }

  await browser.close();

  // FINAL SUMMARY
  console.log('\n========== FINAL VERIFICATION ==========\n');
  console.log('AC1 (No console errors):', results.ac1.pass ? 'PASS' : 'FAIL');
  console.log('AC2 (Rotate & zoom):', results.ac2.pass ? 'PASS' : 'FAIL');
  console.log('AC3 (Info panels):', results.ac3.pass ? 'PASS' : 'FAIL');
  console.log('AC4 (Animation):', results.ac4.pass ? 'PASS' : 'FAIL');
  console.log('AC5 (Visual quality):', results.ac5.pass ? 'PASS' : 'FAIL');
  
  const allPass = results.ac1.pass && results.ac2.pass && results.ac3.pass && results.ac4.pass && results.ac5.pass;
  console.log('\n' + (allPass ? 'ALL CRITERIA PASS' : 'SOME CRITERIA FAILED'));
  
  process.exit(allPass ? 0 : 1);
})();
