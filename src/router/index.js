import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/common/Home.vue'

Vue.use(Router);

export const constantRoutes = [
  {
    path: '/login',
    component: () => import( /* webpackChunkName: "login" */ '../page/Login.vue'),
    meta: {
      title: '登录'
    }
  },
  {
    path: '/',
    component: () => import( /* webpackChunkName: "home" */ '../components/common/Home.vue'),
    meta: {
      title: '系统首页'
    },
    children: [
      {
        path: '/',
        component: () => import( /* webpackChunkName: "dashboard" */ '../page/Dashboard.vue'),
        meta: {
          title: '首页'
        }
      },
      {
        path: '/Dashboard',
        name: 'Dashboard',
        component: () => import( /* webpackChunkName: "dashboard" */ '../page/Dashboard.vue'),
        meta: {
          title: '首页'
        }
      },
      {
        path: '/candidate',
        name: 'candidate',
        component: () => import( /* webpackChunkName: "home" */ '@/page/candidate/index.vue'),
        meta: {
          title: '候选人'
        },
      },
      {
        path: '/company',
        name: 'company',
        component: () => import( /* webpackChunkName: "home" */ '@/page/company/index.vue'),
        meta: {
          title: '公司'
        },
      },
      {
        path: '/contactperson',
        name: 'contactperson',
        component: () => import( /* webpackChunkName: "home" */ '@/page/contactperson/index.vue'),
        meta: {
          title: '联系人'
        },
      },
      {
        path: '/position',
        name: 'position',
        component: () => import( /* webpackChunkName: "home" */ '@/page/position/index.vue'),
        meta: {
          title: '职位'
        },
      },
      {
        path: '*',
        component: () => import( /* webpackChunkName: "404" */ '../page/404.vue'),
        meta: {
          title: '404'
        },
        hidden: true
      },
    ]
  }
]

export const endRoutes = [
  // // 404 page must be placed at the end !!!
  // {
  //   path: '/',
  //   component: () => import( /* webpackChunkName: "home" */ '../components/common/Home.vue'),
  //   meta: {
  //     title: '系统首页'
  //   },
  //   children: [
  //     {
  //       path: '/',
  //       component: () => import( /* webpackChunkName: "dashboard" */ '../page/VueEditor.vue'),
  //       meta: {
  //         title: '系统首页'
  //       }
  //     },
  //     {
  //       path: '*',
  //       component: () => import( /* webpackChunkName: "404" */ '../page/404.vue'),
  //       meta: {
  //         title: '404'
  //       },
  //       hidden: true
  //     },
  //   ]
  // }
]

const router = new Router({
  mode: 'hash',
  scrollBehavior: () => ({
    y: 0,
  }),
  routes: constantRoutes,
})

export function resetRouter() {
  router.matcher = new Router({
    mode: 'hash',
    scrollBehavior: () => ({
      y: 0,
    }),
    routes: constantRoutes,
  }).matcher
}

const originalPush = Router.prototype.push
Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
  return originalPush.call(this, location).catch(err => err)
}

// router.onError((error) => {
//   const pattern = /Loading chunk (\d)+ failed/g;
//   const isChunkLoadFailed = error.message.match(pattern);
//   const targetPath = router.history.pending.fullPath;
//   if (isChunkLoadFailed) {
//     router.replace(targetPath);
//   }
// });

export default router

// export default new Router({
//     routes: [
//         {
//             path: '/',
//             redirect: '/dashboard'
//         },
//         {
//             path: '/',
//             component: () => import(/* webpackChunkName: "home" */ '../components/common/Home.vue'),
//             meta: { title: '自述文件' },
//             children: [
//                 {
//                     path: '/dashboard',
//                     component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
//                     meta: { title: '系统首页' }
//                 },
//                 {
//                     path: '/icon',
//                     component: () => import(/* webpackChunkName: "icon" */ '../components/page/Icon.vue'),
//                     meta: { title: '自定义图标' }
//                 },
//                 {
//                     path: '/tabs',
//                     component: () => import(/* webpackChunkName: "tabs" */ '../components/page/Tabs.vue'),
//                     meta: { title: 'tab选项卡' }
//                 },
//                 {
//                     // 富文本编辑器组件
//                     path: '/editor',
//                     component: () => import(/* webpackChunkName: "editor" */ '../components/page/VueEditor.vue'),
//                     meta: { title: '富文本编辑器' }
//                 },
//                 {
//                     // markdown组件
//                     path: '/markdown',
//                     component: () => import(/* webpackChunkName: "markdown" */ '../components/page/Markdown.vue'),
//                     meta: { title: 'markdown编辑器' }
//                 },
//                 {
//                     // 图片上传组件
//                     path: '/upload',
//                     component: () => import(/* webpackChunkName: "upload" */ '../components/page/Upload.vue'),
//                     meta: { title: '文件上传' }
//                 },
//                 {
//                     // vue-schart组件
//                     path: '/charts',
//                     component: () => import(/* webpackChunkName: "chart" */ '../components/page/BaseCharts.vue'),
//                     meta: { title: 'schart图表' }
//                 },
//                 {
//                     // 拖拽列表组件
//                     path: '/drag',
//                     component: () => import(/* webpackChunkName: "drag" */ '../components/page/DragList.vue'),
//                     meta: { title: '拖拽列表' }
//                 },
//                 {
//                     // 拖拽Dialog组件
//                     path: '/dialog',
//                     component: () => import(/* webpackChunkName: "dragdialog" */ '../components/page/DragDialog.vue'),
//                     meta: { title: '拖拽弹框' }
//                 },
//                 {
//                     // 国际化组件
//                     path: '/i18n',
//                     component: () => import(/* webpackChunkName: "i18n" */ '../components/page/I18n.vue'),
//                     meta: { title: '国际化' }
//                 },
//                 {
//                     // 权限页面
//                     path: '/permission',
//                     component: () => import(/* webpackChunkName: "permission" */ '../components/page/Permission.vue'),
//                     meta: { title: '权限测试', permission: true }
//                 },
//                 {
//                     path: '/404',
//                     component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
//                     meta: { title: '404' }
//                 },
//                 {
//                     path: '/403',
//                     component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
//                     meta: { title: '403' }
//                 },
//                 {
//                     path: '/donate',
//                     component: () => import(/* webpackChunkName: "donate" */ '../components/page/Donate.vue'),
//                     meta: { title: '支持作者' }
//                 }
//             ]
//         },
//         {
//             path: '/login',
//             component: () => import(/* webpackChunkName: "login" */ '../components/page/Login.vue'),
//             meta: { title: '登录' }
//         },
//         {
//             path: '*',
//             redirect: '/404'
//         }
//     ]
// });
