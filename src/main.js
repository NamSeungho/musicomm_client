import Vue from 'vue'
import './plugins/axios'
import alert from './plugins/alert';
import externalSDKs from './plugins/externalSDKs';
import App from './App.vue'
import store from "./store";
import router from './router'
import VueSocketIO from 'vue-socket.io'
import Meta from 'vue-meta'

Vue.config.productionTip = false;

Vue.use(require('vue-script2'));
Vue.use(alert);
Vue.use(externalSDKs);
Vue.use(Meta);
Vue.use(new VueSocketIO({
    debug: false,
    connection: store.getters.serverUrl,
    vuex: {
        store,
        actionPrefix: 'SOCKET_',
        mutationPrefix: 'SOCKET_'
    }
}));

new Vue({
    render: h => h(App),
    store: store,
    router
}).$mount('#app');

ga('set', 'page', router.currentRoute.path); // eslint-disable-line
ga('send', 'pageview'); // eslint-disable-line

router.afterEach(( to ) => {
    ga('set', 'page', to.path); // eslint-disable-line
    ga('send', 'pageview'); // eslint-disable-line
});
