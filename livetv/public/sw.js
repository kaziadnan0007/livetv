// LiveStream PWA Service Worker v1
const CACHE = 'livetv-v1'
const STATIC = [
  '/',
  '/index.html',
  '/manifest.json',
]

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC)).then(() => self.skipWaiting())
  )
})

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  )
})

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url)

  // Never intercept HLS stream requests or M3U playlists
  if (url.pathname.endsWith('.m3u8') || url.pathname.endsWith('.m3u') ||
      url.pathname.endsWith('.ts') || url.hostname.includes('iptv-org')) {
    return
  }

  // Cache-first for static assets
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  )
})
