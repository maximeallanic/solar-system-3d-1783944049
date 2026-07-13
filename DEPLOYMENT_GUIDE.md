# Deployment Guide — Solar System 3D

## Quick Deploy to Vercel (Recommended)

### Prerequisites
- GitHub account with this repository pushed
- Vercel account (free at vercel.com)

### Step 1: Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/solar-system-3d.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to Vercel
```bash
npm install -g vercel
vercel --prod
```

**Result**: Live URL like `https://solar-system-3d.vercel.app`

### Step 3: Verify Deployment
1. Open the live URL
2. Wait for 3D scene to load (~1.5s)
3. Verify all features (see verification checklist below)

---

## Alternative: Self-Hosted Deployment

### Option A: Node.js Server (Heroku, AWS, DigitalOcean)
```bash
npm install
npm run build
npm start
```
Runs on `http://localhost:3000`

### Option B: Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY .next ./
EXPOSE 3000
CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t solar-system-3d .
docker run -p 3000:3000 solar-system-3d
```

### Option C: Static Export (GitHub Pages, Netlify)
```bash
npm run build
# This creates .next/static/ files ready for static hosting
```

---

## Verification Checklist (Live URL)

### 🎯 Core Functionality
- [ ] **Page loads**: No 404 or error pages
- [ ] **Canvas renders**: Three.js scene visible (black background)
- [ ] **No console errors**: Open DevTools → Console tab → no red errors

### 🌍 3D Scene
- [ ] **Sun visible**: Gold ball at center
- [ ] **8 Planets visible**: All planets rendered with correct colors
  - Mercury (#8C7853) — small, gray
  - Venus (#FFC649) — yellowish
  - Earth (#4A90E2) — blue
  - Mars (#E27B58) — reddish
  - Jupiter (#F5DEB3) — pale gold
  - Saturn (#E8D4A8) — tan
  - Uranus (#A8D8EA) — light cyan
  - Neptune (#4166F5) — deep blue
- [ ] **Saturn rings visible**: Tilted, semi-transparent rings around Saturn
- [ ] **Starfield visible**: 1500+ small white dots in background
- [ ] **Orbital lines visible**: Faint gray circles showing orbits

### 🖱️ Interaction
- [ ] **Mouse drag**: Click + drag rotates the camera
- [ ] **Mouse scroll**: Scroll wheel zooms in/out smoothly
- [ ] **Click planet**: Panel slides in from side (desktop) or bottom (mobile)
- [ ] **Info panel**: Shows planet name, type, distance, fact
- [ ] **Close panel**: X button or click outside closes panel
- [ ] **Keyboard 1-8**: Pressing 1 jumps to Mercury, 2 to Venus, etc.
- [ ] **Keyboard Space**: Resets view to home position
- [ ] **Keyboard Escape**: Closes info panel
- [ ] **Arrow keys**: Rotates camera (optional, verify if implemented)

### 📱 Responsive Design
- [ ] **Desktop (1920px)**: Info panel on right side
- [ ] **Tablet (1024px)**: Info panel at bottom center
- [ ] **Mobile (375px)**: Info panel as full-width drawer at bottom
- [ ] **All buttons clickable**: ≥44×44px touch targets
- [ ] **No layout shift**: Opening panel doesn't reflow canvas

### 🎨 Visual Quality
- [ ] **Smooth animations**: Panel slides in/out fluidly
- [ ] **Header visible**: Logo + title + buttons at top
- [ ] **Buttons styled**: Reset and Help buttons have hover effects
- [ ] **Loading spinner**: Shows briefly on first load (~1.5s)
- [ ] **Colors accurate**: Compare to design spec

### ⚡ Performance
- [ ] **Loads in <2s**: Time from page load to interactive
- [ ] **60 FPS steady**: DevTools → Performance → check frame time
- [ ] **No stuttering**: Dragging/zooming is smooth
- [ ] **Memory stable**: DevTools → Memory → ~100MB or less

### ♿ Accessibility
- [ ] **Text readable**: High contrast (#F0F0F0 on #000000)
- [ ] **Tab navigation**: Tab key moves between buttons
- [ ] **Focus visible**: Buttons show cyan outline on focus
- [ ] **Keyboard-only**: Use only keyboard to navigate (1-8, Space, Escape)

### 📊 Browser Compatibility
- [ ] **Chrome/Edge**: Works
- [ ] **Firefox**: Works
- [ ] **Safari**: Works
- [ ] **Mobile browser**: Responsive, touch controls work

---

## Performance Baseline (Expected)

| Metric | Target | Expected |
|--------|--------|----------|
| **First Load** | <2s | ~1.5s |
| **FPS** | 60 FPS | 55-60 FPS |
| **Memory** | <100MB | ~80MB |
| **Bundle Size** | <2.5MB | 307 KB |
| **Lighthouse Score** | 90+ | 90+ (Performance) |

---

## Troubleshooting

### Black Screen / No Content
- Check browser console (F12) for errors
- Ensure WebGL is enabled: `https://get.webgl.org/`
- Try a different browser
- Check internet connection (Three.js assets loading)

### Performance Issues (FPS Drops)
- Reduce star count in `src/lib/designTokens.ts`: `SCENE.starCount: 800` (instead of 1500)
- Disable backdrop-filter in Header for lower-end devices
- Close other browser tabs to free memory
- Test on more powerful device

### Planets Not Clickable / Panel Won't Open
- Check browser console for JavaScript errors
- Ensure you're clicking directly on a planet (not the orbit line)
- Try on desktop first (touch may require longer press on mobile)

### Keyboard Navigation Not Working
- Ensure page has focus (click canvas first)
- Try numpad numbers (1-8) if number row doesn't work
- Press exactly: `1` then `2` etc (not `1+2`)

### Mobile Responsive Not Working
- Force mobile view: DevTools → Toggle device toolbar (Ctrl+Shift+M)
- Check viewport meta tag in HTML source
- Clear browser cache (Ctrl+Shift+Delete)

---

## Post-Deployment Monitoring

### Metrics to Track
1. **Uptime**: 99.9%+ target
2. **Response time**: <200ms
3. **Error rate**: <0.1%
4. **User engagement**: Avg session length, interactions
5. **Performance**: Lighthouse scores

### Analytics Setup (Optional)
```javascript
// Add to src/app/layout.tsx for production monitoring
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

### Error Tracking (Optional)
```bash
npm install @sentry/nextjs
# Then configure in next.config.js for production error reporting
```

---

## Maintenance

### Regular Tasks
- [ ] Monthly: Update dependencies (`npm audit fix`)
- [ ] Quarterly: Review Lighthouse scores
- [ ] As-needed: Respond to user feedback

### Update Procedure
```bash
git pull origin main
npm install
npm run build
# Test locally: npm run dev
git push origin main
# Vercel auto-deploys on push
```

---

## Support & Escalation

### Issues to Report
- 3D scene not rendering (WebGL errors)
- Performance below 30 FPS
- Buttons/interactions not working
- Layout broken on specific devices
- Security warnings in console

### Contact
- Create an issue on GitHub
- Review browser console logs
- Check `/home/agent/workspace/solar-system-3d/README.md` for troubleshooting

---

**Deployment Status**: ✅ **READY**  
**Last Updated**: 2026-07-13  
**Next Review**: 2026-08-13
