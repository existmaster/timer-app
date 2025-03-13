// 이 파일은 next-pwa에 의해 자동으로 생성되는 서비스 워커 파일입니다.
// 실제 배포 시에는 next-pwa가 이 파일을 대체합니다.
// 이 파일은 개발 환경에서 PWA 기능을 테스트하기 위한 목적으로만 사용됩니다.

self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // 기본 fetch 동작 유지
  event.respondWith(fetch(event.request));
}); 