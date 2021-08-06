import Vue from 'vue';
import App from './App.vue';
import router from './router';
import ElementUI from 'element-ui';
import VueI18n from 'vue-i18n';
import { messages } from './utils/i18n';
import Vab from '@/utils/vab'
import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import 'babel-polyfill';
import './assets/css/icon.css';
import './assets/css/index.scss';
import './assets/css/mall.scss'
import './components/common/directives';
import './permission' // 路由
import './assets/css/flex.css'
import store from './store'
import IconTem from '@/components/IconTem'
import * as echarts from 'echarts'

Vue.prototype.$echarts = echarts

Vue.config.productionTip = false;
Vue.component('IconTem', IconTem) // icon组建
Vue.use(Vab)
Vue.use(VueI18n);
Vue.use(ElementUI, {
    size: 'medium'
});
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
