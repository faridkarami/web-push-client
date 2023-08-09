self.addEventListener('push', function (event) {
    const payload = event.data ? event.data.json() : 'no payload';
    event.waitUntil(
        self.registration.showNotification(payload.title, {
            body: payload.body,
            icon: payload.icon
        })
    )
});