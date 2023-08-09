const baseURL = 'http://localhost:3000/api/';

const config = {
    applicationServerKey: 'BK_tD9wgkbsgmVZRIWEMgAQ4e4sQzqb6OywSdLXnl6WWkoQBoGFpk0a3QHs94EAdk-ecAUDbUUjhTw0BCaQ9K5U',
    defaultNotificationData: {
        title: 'Notice from FK8',
        body: 'This is a notification',
        icon: 'https://raw.githubusercontent.com/faridkarami/web-push-client/main/assets/img/bell.png',
    },

    urls: {
        subscribe: `${baseURL}notification/subscribe`,
        updateSubscribe: `${baseURL}notification/update-subscribe`,
        sendPush: `${baseURL}notification/send`,
    }
};

export default config;