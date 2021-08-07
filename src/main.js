import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import VueI18n from 'vue-i18n';
import { messages } from './utils/i18n';
import '@/core/user'

const i18n = new VueI18n({
  locale: 'zh',
  messages
});

new Vue({
  router,
  i18n,
  store,
  render: h => h(App)
}).$mount('#app');
