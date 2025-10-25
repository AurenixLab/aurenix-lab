self.addEventListener('install', e=>{
  e.waitUntil(caches.open('aurenix-v8').then(c=>c.addAll([
    './','./docs.html',
    './enhancements/assets/css/aurenix-upgrade.css',
    './enhancements/assets/js/animated-bg.js',
    './enhancements/assets/js/settings.js',
    './enhancements/assets/js/cmdk.js',
    './enhancements/assets/js/docs.js'
  ])));
});
self.addEventListener('fetch', e=>{
  e.respondWith(caches.match(e.request).then(r=> r || fetch(e.request)));
});