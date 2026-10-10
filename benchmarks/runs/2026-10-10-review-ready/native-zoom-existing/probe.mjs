const {chromium}=await import('file:///C:/Users/chris/Documents/GitHub/fancy-research-tools/node_modules/@playwright/test/index.mjs');
const root='C:/Users/chris/Documents/Codex/2026-10-10/ana/work/native-zoom';
const context=await chromium.launchPersistentContext(root+'/profile',{channel:'chromium',headless:true,viewport:{width:1440,height:900},args:[`--disable-extensions-except=${root}/extension`,`--load-extension=${root}/extension`]});
try {
const sw=context.serviceWorkers()[0]||await context.waitForEvent('serviceworker');
const page=context.pages()[0]; await page.goto('http://127.0.0.1:4173/pilot/');
const before=await page.evaluate(()=>({width:innerWidth,height:innerHeight,dpr:devicePixelRatio,visual:visualViewport.scale}));
const zoom=await sw.evaluate(async()=>{const tabs=await chrome.tabs.query({});const tab=tabs.find(t=>t.url.startsWith('http://127.0.0.1:4173/'));await chrome.tabs.setZoomSettings(tab.id,{mode:'automatic',scope:'per-tab'});await chrome.tabs.setZoom(tab.id,2);return {zoom:await chrome.tabs.getZoom(tab.id),settings:await chrome.tabs.getZoomSettings(tab.id)};});
await page.waitForFunction(()=>devicePixelRatio===2);
const after=await page.evaluate(()=>({width:innerWidth,height:innerHeight,dpr:devicePixelRatio,visual:visualViewport.scale,scrollWidth:document.documentElement.scrollWidth}));
await page.screenshot({path:root+'/pilot-native-200-viewport.png'});
console.log(JSON.stringify({browser:context.browser().version(),before,zoom,after}));
} finally {await context.close();}


