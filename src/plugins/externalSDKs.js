export default {
    install () {
        const adScript = document.createElement('script');
        adScript.async = true;
        adScript.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';
        document.head.appendChild(adScript);

        const naverScript = document.createElement('script');
        naverScript.async = true;
        naverScript.src = '/naverLogin_implicit-1.0.3-min.js';
        document.head.appendChild(naverScript);
    }
}