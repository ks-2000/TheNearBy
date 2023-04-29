const staticCacheName = 'site-static-v2';
const dynamicCacheName = 'site-dynamic-v1'; 
const assets = [
    '/',  
    '/index.html',
    '/pages/about.html',
    '/pages/fallback.html', 
    '/pages/restaurant.html',
    '/js/ui.js',
    '/js/materialize.min.js',
    '/styles.css', 
    '/css/materialize.min.css'
];

//limit cache size
const limitCacheSize = (name, size) => {
  caches.open(name).then(cache => {
    cache.keys().then(keys => {
      if(keys.length > size){
        cache.delete(keys[0]).then(limitCacheSize(name, size));
      }
    });
  });
};
 
self.addEventListener('install',evt => {
    //console.log('service worker has been installed');
    evt.waitUntil(caches.open(staticCacheName).then(cache => {
        console.log('caching shell assets');
        cache.addAll(assets);
        })
    );

    });

//activate event
self.addEventListener('activate', evt => {
    //console.log('service worker has been activated');
    evt.waitUntil(
        caches.keys().then(keys =>{
           // console.log(keys);
           return Promise.all(keys
            .filter(key => key !== staticCacheName && key !== dynamicCacheName)
            .map(key => caches.delete(key))
           )
        })
    );
});

// fetch event
self.addEventListener('fetch', evt => {
  //console.log('fetch event', evt);
  evt.respondWith(
    caches.match(evt.request).then(cacheRes => {
      return cacheRes || fetch(evt.request).then(fetchRes => {
        return caches.open(dynamicCacheName).then(cache => {
          cache.put(evt.request.url, fetchRes.clone());
          // check cached items size
          limitCacheSize(dynamicCacheName, 3);
          limitCacheSize(staticCacheName, 2);
          return fetchRes;
        })
      });
    }).catch(() => {
      if(evt.request.url.indexOf('.html') > -1){
        return caches.match('/pages/fallback.html');
      } 
    })
  );
});
