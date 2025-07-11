// Service Worker para invalidação de cache
const CACHE_NAME = 'fuseloja-cache-v' + Date.now();
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css'
];

// Install event
self.addEventListener('install', function(event) {
  // Força ativação imediata do novo service worker
  self.skipWaiting();
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event
self.addEventListener('activate', function(event) {
  // Assume controle imediatamente
  self.clients.claim();
  
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          // Remove caches antigos
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event
self.addEventListener('fetch', function(event) {
  // Para requisições da API ou dados de autenticação, sempre busca da rede
  if (event.request.url.includes('/auth/') || 
      event.request.url.includes('/api/') ||
      event.request.url.includes('localhost:3000')) {
    event.respondWith(
      fetch(event.request)
        .then(function(response) {
          return response;
        })
        .catch(function() {
          // Em caso de erro de rede, tenta o cache
          return caches.match(event.request);
        })
    );
    return;
  }

  // Para outros recursos, usa estratégia cache-first com invalidação
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - retorna resposta do cache
        if (response) {
          // Mas também busca uma versão atualizada em background
          fetch(event.request).then(function(fetchResponse) {
            if (fetchResponse && fetchResponse.status === 200) {
              const responseClone = fetchResponse.clone();
              caches.open(CACHE_NAME).then(function(cache) {
                cache.put(event.request, responseClone);
              });
            }
          });
          return response;
        }

        // Cache miss - busca da rede
        return fetch(event.request)
          .then(function(response) {
            // Verifica se é uma resposta válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clona a resposta
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then(function(cache) {
                cache.put(event.request, responseToCache);
              });

            return response;
          });
      })
  );
});

// Escuta mensagens para limpeza forçada de cache
self.addEventListener('message', function(event) {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            return caches.delete(cacheName);
          })
        );
      }).then(function() {
        // Notifica que o cache foi limpo
        self.clients.matchAll().then(clients => {
          clients.forEach(client => {
            client.postMessage({type: 'CACHE_CLEARED'});
          });
        });
      })
    );
  }
});