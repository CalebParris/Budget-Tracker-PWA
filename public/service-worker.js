// Variables to be used in the service worker
const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

const iconSizes = ["192", "512"];
const iconFiles = iconSizes.map((size) => `/icons/icon-${size}x${size}.png`);

const staticFilesToPreCache = [
    "/",
    "/index.html",
    "/index.js",
    "/manifest.webmanifest",
    "/styles.css",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
].concat(iconFiles);

// Install Listener
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Files successfully pre-cached");
            return cache.addAll(staticFilesToPreCache);
        })
    );
    self.skipWaiting();
});

// Activate Listener
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((keyList) => {
            return Promise.all(
                keyList.map((key) => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME){
                        console.log("Removing old cache data", key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Fetch Listener
self.addEventListener("fetch", (event) => {
    if (event.request.url.includes("/api/")){
        event.respondWith(
            caches.open(DATA_CACHE_NAME).then((cache) => {
                return fetch(event.request)
                .then((response) => {
                    if (response.status === 200){
                        cache.put(event.request, response.clone());
                    }
                    return response;
                })
                .catch((err) => {
                    return cache.match(event.request);
                });
            }).catch((err) => console.log(err))
        );
    } else {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return cache.match(event.request).then((response) => {
                    return response || fetch(event.request);
                });
            })
        );
    }
});