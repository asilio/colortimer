var CACHE_NAME = "V1";

var ASSETS =[
      "/index.html", 
      "/main.js", 
      "/manifest.json", 
      "/modules/database.js", 
      "/modules/aac.js"
];

self.addEventListener("install", event=>{
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache=>{
      return cache.addAll(ASSETS);
    })
  )
});

self.addEventListener("activate", event=>{
  //console.log("Service Worker Activated");
});

var OFFLINE_PAGE = "index.html";

self.addEventListener("fetch", event=>{
  if(event.request.method === "GET"){
    event.respondWith(
      caches.match(event.request).then(cached=>{
        var networked = fetch(event.request)
          .then(res=>{
            var response = res.clone();

            caches.open(CACHE_NAME).then(cache=>cache.put(event.request, response));

            return res;
          })
          .catch(()=>caches.match(OFFLINE_PAGE));

        return cached || networked;
      })

    );
  }
});
