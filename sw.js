const CACHE_NAME = 'rabiprev-v1';
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

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
      );
    })
  );
});
