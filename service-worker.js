const CACHE_NAME='pixel-survival-modular-landscape-v2-fast-menu';
const ASSETS=[
  './','./index.html','./style.css','./manifest.webmanifest',
  './core/engine.js','./core/render.js','./core/input.js','./core/gameLoop.js',
  './systems/player.js','./systems/world.js','./systems/inventory.js','./systems/combat.js','./systems/crafting.js','./systems/ai.js','./systems/building.js','./systems/farming.js','./systems/weather.js','./systems/save.js','./systems/audio.js',
  './ui/hud.js','./ui/menu.js','./ui/inventoryUI.js','./ui/craftingUI.js','./ui/mobileControls.js',
  './assets/favicon.svg','./assets/icon-192.png','./assets/icon-512.png','./assets/cover.png','./assets/sprites_placeholder.png','./assets/tileset_placeholder.png'
];

self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE_NAME).then(cache=>cache.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.map(k=>k!==CACHE_NAME?caches.delete(k):null))));
  self.clients.claim();
});

async function networkFirst(request){
  const cache=await caches.open(CACHE_NAME);
  try{
    const fresh=await fetch(request,{cache:'no-store'});
    if(fresh&&fresh.ok)cache.put(request,fresh.clone());
    return fresh;
  }catch(e){
    return (await cache.match(request)) || (await cache.match('./index.html'));
  }
}

async function cacheFirst(request){
  const cached=await caches.match(request);
  if(cached)return cached;
  const fresh=await fetch(request);
  const cache=await caches.open(CACHE_NAME);
  if(fresh&&fresh.ok)cache.put(request,fresh.clone());
  return fresh;
}

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  const url=new URL(event.request.url);
  const isCode=url.pathname.endsWith('.html')||url.pathname.endsWith('.js')||url.pathname.endsWith('.css')||url.pathname.endsWith('.webmanifest')||event.request.mode==='navigate';
  event.respondWith(isCode?networkFirst(event.request):cacheFirst(event.request));
});
