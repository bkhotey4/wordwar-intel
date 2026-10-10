const V='ww-1791674989058', S='ww-shelters-20261008T172402677Z';
const CORE=['./prepare.html','./style.css','./manifest.webmanifest','./icon-192.png','./icon-512.png','./index.html','./shelters/index.json'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>c.addAll(CORE)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V&&k!==S).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url);
  if(e.request.method!=='GET'||u.origin!==location.origin)return;
  if(/\/shelters\/t_/.test(u.pathname)){
    e.respondWith(caches.open(S).then(c=>c.match(e.request).then(hit=>hit||fetch(e.request).then(r=>{if(r.ok)c.put(e.request,r.clone());return r}))));return;
  }
  if(/\.(jpg|jpeg|webp)$/i.test(u.pathname))return;
  // 網頁與資料一律向伺服器確認最新版（避免瀏覽器快取讓新內容晚 10 分鐘才出現），斷網才用快取
  e.respondWith(fetch(u.href,{cache:'no-cache',credentials:'same-origin'}).then(r=>{if(r.ok){const cp=r.clone();caches.open(V).then(c=>c.put(e.request,cp))}return r})
    .catch(()=>caches.match(e.request).then(hit=>hit||(e.request.mode==='navigate'?caches.match('./prepare.html'):undefined))));
});