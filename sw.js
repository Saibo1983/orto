// Service worker: tiene l'app in memoria per usarla anche senza connessione.
// Quando aggiorni i file, cambia il numero della versione qui sotto.
const VERSIONE = 'progetto-orto-v6';
const FILE = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png', 'icon.svg', 'sfondo.jpg', 'LICENZA.txt'];
self.addEventListener('install', e => { e.waitUntil(caches.open(VERSIONE).then(c => c.addAll(FILE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== VERSIONE).map(n => caches.delete(n)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const r = e.request; if (r.method !== 'GET') return;
  e.respondWith(caches.match(r).then(hit => {
    const rete = fetch(r).then(res => { if (res && (res.ok || res.type === 'opaque')) { const copia = res.clone(); caches.open(VERSIONE).then(c => c.put(r, copia)); } return res; }).catch(() => hit);
    return hit || rete;   // prima la copia salvata, e intanto la aggiorna dalla rete
  }));
});
