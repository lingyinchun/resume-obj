import Vue from 'vue'
import axios from 'axios'
import store from '../store'
import router from '@/router'
import { getSessionId, removeSessionId } from '@/utils/SessionId'

// let loadingInstance
let tokenStr = 0

const handleCode = (code, message) => {
  console.log('handleCode====',code,message)
  switch (code) {
    case 401:
      Vue.prototype.$baseMessage(message || `后端接口${code}异常`, 'error')
      // store.dispatch('user/resetAccessToken').catch(() => {})
      // if (loginInterception) {
      //   location.reload()
      // }
      break
    case 402:
      router.push({
        path: '/401'
      }).catch(() => {})
      break
    case 600:
      removeSessionId()
      router.push({
        path: '/login'
      }).catch(() => {})
    case 601:
      removeSessionId()
      router.push({
        path: '/login'
      }).catch(() => {})
    default:
      Vue.prototype.$baseMessage(message || `后端接口${code}异常`, 'error')
      break
  }
}

const service = axios.create({
  // process.env.NODE_ENV === 'development' 来判断是否开发环境
  // easy-mock服务挂了，暂时不使用了
  // baseURL: 'https://www.easy-mock.com/mock/592501a391470c0ac1fab128',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8',
  },
});

service.interceptors.request.use(
  config => {
    // console.log(config)
    if (getSessionId()) {
      config.headers['Authorization'] = getSessionId()
      // config.headers['tokenStr'] = tokenStr
    }
    // loadingInstance = Vue.prototype.$baseLoading()
    store.dispatch('permission/setPageLoading', true)
    return config;
  },
  error => {
    return Promise.reject();
  }
);

service.interceptors.response.use(
  response => {
    // if (loadingInstance) loadingInstance.close()
    store.dispatch('permission/setPageLoading', false)
    // console.log('响应', response instanceof Blob)
    // console.log(response.data instanceof Blob)
    // 如果文件
    if(response.data instanceof Blob){
      return response.data
    }
    if (response.data.code === 200) {
      // tokenStr++
      return response.data;
    } else {
      handleCode(response.data.code, response.data.message)
      // console.log('响应====', response)
      // return response.data;
      return Promise.reject(
        '请求异常拦截:' +
          JSON.stringify({ code: response.data.code, message: response.data.message }) || 'Error'
      )
    }
  },
  error => {
    // loadingInstance.close()
    store.dispatch('permission/setPageLoading', false)
    console.log(error)
    Vue.prototype.$baseMessage('服务器正忙，请稍后再试', 'error')
    return Promise.reject(error);
  }
);

export default service;
