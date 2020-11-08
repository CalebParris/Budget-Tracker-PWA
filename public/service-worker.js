// Variables to be used in the service worker
const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

const iconSizes = ["192", "512"];
const iconFiles = iconSizes.map((size) => `/icons/icon-${size}x${size}.png`);

const staticFilesToPreCache = [
    "/",
    "/index.js",
    "/manifest.webmanifest"
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

// Fetch Listener