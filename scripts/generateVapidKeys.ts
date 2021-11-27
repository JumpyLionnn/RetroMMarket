const webpush = require('web-push');

// VAPID keys should be generated only once.
const vapidKeys = webpush.generateVAPIDKeys();

console.log(`public: ${vapidKeys.publicKey}`);
console.log(`private: ${vapidKeys.privateKey}`);