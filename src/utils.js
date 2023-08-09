const userAgent = navigator.userAgent;

const utils = {
    urlB64ToUint8Array: (base64String) => {
        const padding = '='.repeat((4 - base64String.length % 4) % 4);
        const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
        const rawData = window.atob(base64);
        const outputArray = new Uint8Array(rawData.length);
        
        for (let i = 0; i < rawData.length; ++i) {
            outputArray[i] = rawData.charCodeAt(i);
        }
        
        return outputArray;
    },

    getPlatform: () => {
        let result = 'Unknown platform!' + userAgent;

        const userDeviceArray = [
            { device: 'Android', platform: /Android/ },
            { device: 'iPhone', platform: /iPhone/ },
            { device: 'iPad', platform: /iPad/ },
            { device: 'Symbian', platform: /Symbian/ },
            { device: 'Windows Phone', platform: /Windows Phone/ },
            { device: 'Tablet OS', platform: /Tablet OS/ },
            { device: 'Linux', platform: /Linux/ },
            { device: 'Windows', platform: /Windows NT/ },
            { device: 'Macintosh', platform: /Macintosh/ }
        ];
    
        for (const iterator of userDeviceArray) {
            if (iterator.platform.test(userAgent)) {
                result = iterator.device;
                break;
            }
        }
    
        return result;
    },

    getBrowser: () => {
        let model = userAgent.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        let temp;
    
        if (/trident/i.test(model[1])) {
            temp = /\brv[ :]+(\d+)/g.exec(userAgent) || [];
            return { name: 'IE', version: (temp[1] || '') };
        }
    
        if (model[1] === 'Chrome') {
            temp = userAgent.match(/\bOPR|Edge\/(\d+)/)
            if (temp != null) { return { name: 'Opera', version: temp[1] }; }
        }
    
        model = model[2] ? [model[1], model[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((temp = userAgent.match(/version\/(\d+)/i)) != null) {
            model.splice(1, 1, temp[1]);
        }

        return {
            name: model[0],
            version: model[1]
        };
    },
};

export default utils;