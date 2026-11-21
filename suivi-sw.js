/* App « Suivre l'auto » (suivi.html v3, 21 nov. 2026) : garde la page pour l'ouvrir sans réseau.
   Seulement /suivi… (pas le reste du site). Réseau d'abord : toujours la dernière version quand il y a du réseau.
   Les positions (Worker ram-suivi) et la carte (OpenStreetMap) ne passent pas par ici. */
const C='suivi-v3', SHELL=['suivi.html','suivi.webmanifest','suivi-192.png','suivi-512.png'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(C).then(c=>c.addAll(SHELL)).catch(()=>{}).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k.startsWith('suivi-')&&k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{
  const u=new URL(e.request.url); if(e.request.method!=='GET'||u.origin!==location.origin) return;
  const k=u.pathname.endsWith('/suivi.html')?'suivi.html':e.request;
  e.respondWith(fetch(e.request).then(r=>{ if(r.ok){ const cp=r.clone(); caches.open(C).then(c=>c.put(k,cp)).catch(()=>{}); } return r; })
    .catch(()=>caches.match(k).then(r=>r||Response.error())));
});
