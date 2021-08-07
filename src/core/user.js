import Vue from 'vue';
import ElementUI from 'element-ui';
import Vab from '@/utils/vab'
import IconTem from '@/components/IconTem'
import * as echarts from 'echarts'
import VueI18n from 'vue-i18n';

import 'element-ui/lib/theme-chalk/index.css'; // 默认主题
// import './assets/css/theme-green/index.css'; // 浅绿色主题
import 'babel-polyfill';
import '@/assets/css/icon.css';
import '@/assets/css/index.scss';
import '@/assets/css/mall.scss'
import '@/components/common/directives';
import '@/permission' // 路由
import '@/assets/css/flex.css'

Vue.prototype.$echarts = echarts
Vue.config.productionTip = false;
Vue.component('IconTem', IconTem) // icon组建
Vue.use(Vab)
Vue.use(VueI18n);
Vue.use(ElementUI, {
  size: 'medium'
});
