let cacheName = "password-manager";
let filesToCache = [
    "/",
    "/index.html",
    "/styles/index.css",
    "/styles/loginScreen.css",
    "/styles/mainScreen.css",
    "/styles/listScreen.css",
    "/styles/accessScreen.css",
    "/styles/editScreen.css",
    "/styles/createScreen.css",
    "/styles/settingsScreen.css",
    "/scripts/index.js"
];

self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(cacheName).then(function (cache) {
        return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener("fetch", (e) => {
    e.respondWith(
        caches.match(e.request).then((response) => {
        return response || fetch(e.request);
        })
    );
});
