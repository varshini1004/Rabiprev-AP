const CACHE_NAME = 'rabiprev-v3';
const urlsToCache = [
  '/Rabiprev-AP/',
  '/Rabiprev-AP/index.html',
  '/Rabiprev-AP/css/style.css',
  '/Rabiprev-AP/js/app.js',
  '/Rabiprev-AP/js/data/contacts.js',
  '/Rabiprev-AP/js/data/guides.js',
  '/Rabiprev-AP/js/components/cards.js',
  '/Rabiprev-AP/js/components/guide.js',
  '/Rabiprev-AP/js/components/theme.js',
  '/Rabiprev-AP/js/utils/filters.js',
  '/Rabiprev-AP/js/utils/progress.js',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css'
];

// Install event – cache all critical files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caching app files');
      return cache.addAll(urlsToCache);
    })
  );
  // Activate worker immediately
  self.skipWaiting();
});

// Fetch event – serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        return response;
      }
      // If not in cache, try network (but for offline, this will fail – you could return a fallback page)
      return fetch(event.request).catch(() => {
        // Optional: return a custom offline page
        return caches.match('/Rabiprev-AP/offline.html');
      });
    })
  );
});

// Activate event – clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
  event.waitUntil(clients.claim());
});
