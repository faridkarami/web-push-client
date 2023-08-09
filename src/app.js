import config from './config.js';
import utils from './utils.js';


if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js');
}

const platform = utils.getPlatform(),
    browser = utils.getBrowser(),
    triggerPush = document.querySelector('#trigger-1'),
    triggerSave = document.querySelector('#trigger-2'),
    triggerType = document.querySelector('#trigger-3'),
    dashboard = document.querySelector('#dashboard');

const getNotificationTypes = () => {
    const result = [];
    const typeElements = document.querySelectorAll('.typesGroup input[type=checkbox]:checked');

    typeElements.map(item => {
        result.push(item.value);
    })

    return result;
};

async function triggerPushNotification() {
    const register = await navigator.serviceWorker.ready;

    const subscription = await register.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: utils.urlB64ToUint8Array(config.applicationServerKey),
    });

    const sub = subscription.toJSON();

    const payload = {
        language: navigator.language,
        auth: sub.keys.auth,
        p256dh: sub.keys.p256dh,
        endpoint: subscription.endpoint,
    }

    payload.platform = platform ? platform : '';
    payload.browser = browser ? browser : '';

    await fetch(config.urls.subscribe, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json',
        },
    });

    dashboard.removeAttribute('hidden');
}

async function triggerSendNotify() {
    await fetch(config.urls.sendPush, {
        method: 'POST',
        body: JSON.stringify({
            types: [],
            payload: {
                ...config.defaultNotificationData,
                expirationTime: 10,
            }
        }),
        headers: {
            'Content-Type': 'application/json',
        }
    });
}

triggerPushNotification().catch(error => console.error(error));

triggerPush.addEventListener('click', () => {
    triggerSendNotify().catch(error => console.error(error));
});

const saveNotifyType = async (subscription) => {
    const types = getNotificationTypes();

    if (types.length) {
        const sub = subscription.toJSON()
        
        const payload = {
            auth: sub.keys.auth,
            p256dh: sub.keys.p256dh,
            endpoint: subscription.endpoint,
        };

        await fetch(config.urls.updateSubscribe, {
            method: 'POST',
            body: JSON.stringify({
                ...payload,
                notifyType,
            }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } else {
        alert('Please select a type!')
    }
}

const sendNotifyTypes = async () => {
    const types = getNotificationTypes();

    if (types.length) {
        await fetch(config.urls.sendPush, {
            method: 'POST',
            body: JSON.stringify({
                types: types,
                payload: {
                    ...config.defaultNotificationData,
                    expirationTime: 1,
                }
            }),
            headers: {
                'Content-Type': 'application/json',
            }
        });
    } else {
        alert('Please select a type!')
    }
}

navigator.serviceWorker.ready.then(function (serviceWorkerRegistration) {
    serviceWorkerRegistration.pushManager.getSubscription()
        .then((subscription) => {
            if (subscription) {
                dashboard.removeAttribute('hidden');

                triggerSave.addEventListener('click', () => {
                    saveNotifyType(subscription)
                })

                triggerType.addEventListener('click', () => {
                    sendNotifyTypes()
                })
            }
        })
        .catch((err) => {
            console.log(err)
        });
})