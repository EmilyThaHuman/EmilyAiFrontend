// Name of the cache
const CACHE_NAME = 'my-cache-v2'; // Incremented the cache version

// List of files to cache
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/static/css/main.css',
  '/static/js/main.js',
  '/service-worker.js', // Add your other assets here
  '/offline.html', // Assuming you have an offline fallback page
];

// Install event: Cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Opened cache');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log(`Deleting cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event: Intercept requests and serve cached files
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      if (cachedResponse) {
        // Serve the cached response immediately
        return cachedResponse;
      }
      // Fetch from network and cache the response for future use
      return fetch(event.request).then(networkResponse => {
        return caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, networkResponse.clone());
          return networkResponse;
        });
      });
    })
  );
});

// self.addEventListener('fetch', event => {
//   event.respondWith(
//     caches.match(event.request).then(response => {
//       if (response) {
//         return response; // Return cached response if found
//       }
//       return fetch(event.request)
//         .then(networkResponse => {
//           if (event.request.method === 'GET') {
//             return caches.open(CACHE_NAME).then(cache => {
//               cache.put(event.request, networkResponse.clone());
//               return networkResponse;
//             });
//           }
//           return networkResponse;
//         })
//         .catch(() => {
//           // Fallback to offline.html if network is not available
//           return caches.match('/offline.html');
//         });
//     })
//   );
// });
