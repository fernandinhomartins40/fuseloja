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
    })
  );
});

// Fetch event - estratégias de cache inteligentes
self.addEventListener('fetch', function(event) {
  // Ignora requisições que não são http/https
  if (!event.request.url.startsWith('http')) {
    return;
  }

  // Pular requisições da API - sempre ir para rede
  if (event.request.url.includes('/api/') || 
      event.request.url.includes(':3001') ||
      event.request.url.includes('82.25.69.57')) {
    event.respondWith(
      fetch(event.request)
        .catch(function(error) {
          console.log('Service Worker: Network error for API request', error);
          return new Response(
            JSON.stringify({ error: 'Network error' }),
            { 
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'application/json' }
            }
          );
        })
    );
    return;
  }

  // Para outros recursos: network-first com timeout rápido
  event.respondWith(
    Promise.race([
      fetch(event.request)
        .then(function(response) {
          // Se sucesso, atualiza cache e retorna
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(function(cache) {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(function(error) {
          console.log('Service Worker: Network error', error);
          // Se erro de rede, tenta cache
          return caches.match(event.request);
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
    ]).catch(function(error) {
      console.log('Service Worker: Final fallback error', error);
      // Em caso de erro, tenta cache uma última vez
      return caches.match(event.request)
        .then(function(cachedResponse) {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Se não há cache, retorna uma resposta de erro apropriada
          return new Response(
            'Resource not available offline',
            { 
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'text/plain' }
            }
          );
        });
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

// Error handling global para promises não tratadas
self.addEventListener('unhandledrejection', function(event) {
  console.log('Service Worker: Unhandled promise rejection', event.reason);
  event.preventDefault();
});