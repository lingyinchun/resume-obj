import router from './router'
import store from './store'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getSessionId } from '@/utils/SessionId'

// NProgress.configure({ showSpinner: false }) // NProgress Configuration

//使用钩子函数对路由进行权限跳转
router.beforeEach(async (to, from, next) => {
  // console.log(to)
  NProgress.start()
  let title = '瀚德后台管理系统';
  if (to.meta.title) {
    title = title + '-' + to.meta.title;
  }
  document.title = title;
  const role = getSessionId();
  next();
  return
  // 未登录 且 login
  if (!role && to.path === '/login') {
    NProgress.done()
    next();
  } else {
    // 未登录 直接进 login
    if (!role) {
      NProgress.done()
      next('/login')
      return;
    } else {
      // 已登录 进 login
      if (to.path === '/login') {
        console.log('已经登录啦')
        NProgress.done()
        next('/')
        return
      }
    }
    // if (!store.getters['is_routes']) {
    //   const accessRoutes = await store.dispatch('permission/generateRoutes')
    //   // console.log('accessRoutes====', accessRoutes)
    //   router.addRoutes(accessRoutes)
    //   // console.log('最终路由', router)
    //   next({ ...to, replace: true })
    // }

    // 简单的判断IE10及以下不进入富文本编辑器，该组件不兼容
    if (navigator.userAgent.indexOf('MSIE') > -1 && to.path === '/editor') {
      Vue.prototype.$alert('vue-quill-editor组件不兼容IE10及以下浏览器，请使用更高版本的浏览器查看', '浏览器不兼容通知', {
        confirmButtonText: '确定'
      });
    } else {
      next();
    }
  }
  NProgress.done()
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
