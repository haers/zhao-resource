// 升级前后使用同一组页面和视口；仅隐藏随机画布并冻结动画以便比较，不修改站点源码。
const { chromium } = require(process.env.QA_PLAYWRIGHT_MODULE || 'playwright');
const fs = require('node:fs');
const path = require('node:path');
const phase = process.argv[2];
if (!['before', 'after'].includes(phase)) throw Error('阶段必须是before或after');
const origin = process.env.QA_ORIGIN || 'http://127.0.0.1:8329';
if (!['127.0.0.1', 'localhost'].includes(new URL(origin).hostname)) throw Error('仅允许本机预览');
const root = path.resolve('work/vitepress-upgrade-20261027', phase);
if (phase === 'before' && fs.existsSync(path.join(root, 'pages.json'))) throw Error('升级前基线已存在，禁止覆盖');
fs.mkdirSync(root, { recursive: true });
(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  const results = [];
  try {
    for (const width of [1280, 390]) for (const theme of ['light', 'dark']) {
      const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
      await context.addInitScript(theme => localStorage.setItem('vitepress-theme-appearance', theme), theme);
      const page = await context.newPage();
      page.setDefaultTimeout(15000);
      for (const route of ['/', '/nav.html', '/books-audiobooks.html', '/square-dance.html', '/sponsor.html']) {
        const errors = [], failed = [];
        const onError = e => errors.push(e.message);
        const onResponse = r => { if (r.url().startsWith(origin) && r.status() >= 400) failed.push([r.status(), r.url()]); };
        page.on('pageerror', onError); page.on('response', onResponse);
        const response = await page.goto(origin + route, { waitUntil: 'domcontentloaded', timeout: 30000 });
        if (response.status() !== 200) throw Error(route + '未返回200');
        await page.locator('h1').first().waitFor();
        await page.waitForFunction(() => !!document.querySelector('.VPNavBarSearch button'));
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(800);
        const id = `${route === '/' ? 'home' : route.slice(1, -5)}-${width}-${theme}`;
        if (route === '/' && width === 1280 && theme === 'dark') await page.screenshot({ path: `${root}/${id}-raw.png` });
        await page.addStyleTag({ content: 'canvas { visibility: hidden !important; } *,*::before,*::after { animation: none !important; transition: none !important; }' });
        await page.mouse.move(0, 899);
        await page.screenshot({ path: `${root}/${id}.png`, animations: 'disabled' });
        const data = await page.evaluate(() => ({
          title: document.querySelector('h1')?.textContent,
          lang: document.documentElement.lang,
          dark: document.documentElement.classList.contains('dark'),
          overflow: document.documentElement.scrollWidth > innerWidth,
          headings: [...document.querySelectorAll('h1,h2')].map(n => n.textContent),
          links: [...document.querySelectorAll('a[href]')].map(n => n.getAttribute('href')),
          regions: ['.VPNav', '.VPContent', '.VPDoc .content-container', 'h1'].map(s => {
            const n = document.querySelector(s); if (!n) return [s, null];
            const r = n.getBoundingClientRect(); const c = getComputedStyle(n);
            return [s, { x: r.x, y: r.y, width: r.width, height: r.height, fontSize: c.fontSize }];
          })
        }));
        results.push({ id, ...data, errors, failed });
        page.off('pageerror', onError); page.off('response', onResponse);
      }
      // 本地搜索的真实交互与空结果；禁止外部评论发表或资源下载。
      await page.locator('.VPNavBarSearch button').click();
      const input = page.locator('input[type="search"]'); await input.fill('电子书');
      await page.locator('.VPLocalSearchBox a').first().waitFor();
      await page.screenshot({ path: `${root}/search-${width}-${theme}.png` });
      await input.fill('zzzz-no-result-20261027');
      await page.waitForTimeout(400);
      const empty = await page.locator('.VPLocalSearchBox').innerText();
      fs.writeFileSync(`${root}/search-${width}-${theme}.txt`, empty);
      await page.keyboard.press('Escape');
      await context.close();
    }
    fs.writeFileSync(`${root}/pages.json`, JSON.stringify(results, null, 2));
    if (results.some(x => x.errors.length || x.failed.length || x.overflow)) process.exitCode = 1;
    console.log(JSON.stringify({ phase, pages: results.length, errors: results.filter(x => x.errors.length || x.failed.length).map(x => ({ id: x.id, errors: x.errors, failed: x.failed })), overflow: results.filter(x => x.overflow).map(x => x.id) }));
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
