// Service Worker simplificado para melhor performance
const CACHE_NAME = 'fuseloja-v1';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css'
];

// Install event - cache recursos essenciais apenas
self.addEventListener('install', function(event) {
  // Ativa imediatamente o novo service worker
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Service Worker: Cache opened');
        return cache.addAll(urlsToCache);
      })
      .catch(function(error) {
        console.log('Service Worker: Cache failed', error);
      })
  );
});

// Activate event - limpa caches antigos
self.addEventListener('activate', function(event) {
  console.log('Service Worker: Activated');
  
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function() {
      return self.clients.claim();
    })
  );
});

// Fetch event - estratégia network-first para melhor performance
self.addEventListener('fetch', function(event) {
  // Pular requisições não GET
  if (event.request.method !== 'GET') {
    return;
  }

  // Pular requisições da API - sempre ir para rede
  if (event.request.url.includes('/api/') || 
      event.request.url.includes(':3000') ||
      event.request.url.includes('82.25.69.57')) {
    event.respondWith(fetch(event.request));
    return;
  }

  // Para outros recursos: network-first com timeout rápido
  event.respondWith(
    Promise.race([
      fetch(event.request).then(function(response) {
        // Se sucesso, atualiza cache e retorna
        if (response && response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(function(cache) {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      }),
      // Timeout de 2 segundos - se não responder, usa cache
      new Promise(function(resolve, reject) {
        setTimeout(function() {
          caches.match(event.request).then(function(cachedResponse) {
            if (cachedResponse) {
              resolve(cachedResponse);
            } else {
              reject(new Error('Network timeout and no cache'));
            }
          });
        }, 2000);
      })
    ]).catch(function() {
      // Em caso de erro, tenta cache
      return caches.match(event.request);
    })
  );
});

// Mensagens do client
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME).then(function() {
      event.ports[0].postMessage({type: 'CACHE_CLEARED'});
    });
  }
});