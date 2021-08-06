import Vue from 'vue';
import Router from 'vue-router';
import Home from '@/components/common/Home.vue'

Vue.use(Router);

export const constantRoutes = [
  // {
  //   path: '/',
  //   component: () => import( /* webpackChunkName: "home" */ '../components/common/Home.vue'),
  //   meta: {
  //     title: '-'
  //   },
  //   children: [
  //     {
  //       path: '/',
  //       component: () => import( /* webpackChunkName: "dashboard" */ '../page/Icon.vue'),
  //       meta: {
  //         title: '系统首页'
  //       }
  //     }
  //   ]
  // },
  // {
  //   path: '/vip/userGrowth',
  //   component: () => import(/* webpackChunkName: "tabs" */ '../components/common/Home.vue'),
  //   meta: { title: '查看明细' },
  //   children: [
  //     {
  //       path: '/vip/userGrowth',
  //       component: () => import('../page/vip/userGrowth.vue'),
  //       meta: { title: '查看明细' },
  //     }
  //   ]
  // },
  {
    path: '/login',
    component: () => import( /* webpackChunkName: "login" */ '../page/Login.vue'),
    meta: {
      title: '登录'
    }
  }
]

export const endRoutes = [
  // 404 page must be placed at the end !!!
  {
    path: '/',
    component: () => import( /* webpackChunkName: "home" */ '../components/common/Home.vue'),
    meta: {
      title: '系统首页'
    },
    children: [
      {
        path: '/',
        component: () => import( /* webpackChunkName: "dashboard" */ '../page/VueEditor.vue'),
        meta: {
          title: '系统首页'
        }
      },
      {
        path: '/vip/userGrowth',
        component: () => import( /* webpackChunkName: "dashboard" */ '../page/vip/userGrowth.vue'),
        meta: {
          title: '查看明细',
          id: 'a1',
          type: 1,
          iframeUrl: ''
        },
      },
      {
        path: '/vip/integral/info',
        component: () => import( /* webpackChunkName: "dashboard" */ '../page/vip/integral/info.vue'),
        meta: {
          title: '积分明细',
          id: 'a1',
          type: 1,
          iframeUrl: ''
        },
      },
      {
        path: '/vip/userInfo',
        component: () => import( /* webpackChunkName: "dashboard" */ '../page/vip/userInfo.vue'),
        meta: {
          title: '用户信息',
          id: 'vipUserInfo',
          type: 1,
          iframeUrl: ''
        },
      },
      {
        path: '/cms/advert',
        component: () => import('../page/cms/advert.vue'),
        meta: {
          title: '广告设置',
          id: 'cmsAdvert',
          type: 1,
          iframeUrl: ''
        },
      },
      {
        path: '/goods/category/edit',
        component: () => import('../page/goods/category/edit.vue'),
        meta: {
          title: '编辑类目',
          id: 'goodsCategoryEdit',
          type: 1,
          iframeUrl: ''
        },
      },
      {
        path: '/order/detail',
        component: () => import('../page/order/detail.vue'),
        meta: {
          title: '订单详情',
          id: 'orderDetail',
          type: 1,
          iframeUrl: ''
        },
      },
      {
        path: '/marketing/coupon/couponForm',
        component: () => import('../page/marketing/coupon/couponForm.vue'),
        meta: {
          title: '优惠券',
          id: 'coupon',
          type: 1,
          iframeUrl: ''
        },
      },
      {
        path: '/marketing/coupon/couponRecord',
        component: () => import('../page/marketing/coupon/couponRecord.vue'),
        meta: {
          title: '优惠券记录',
          id: 'coupon',
          type: 1,
          iframeUrl: ''
        },
      },
      {
        path: '/marketing/promotionCp/couponForm',
        component: () => import('../page/marketing/promotionCp/couponForm.vue'),
        meta: {
          title: '促销活动',
          id: 'promotionCp',
          type: 1,
          iframeUrl: ''
        },
      },
      {
        path: '/marketing/promotionGive/couponForm',
        component: () => import('../page/marketing/promotionGive/couponForm.vue'),
        meta: {
          title: '活动详情',
          id: 'promotionGive',
          type: 1,
          iframeUrl: ''
        },
      },
      {
        path: '/marketing/promotionRecord',
        component: () => import('../page/marketing/promotionRecord.vue'),
        meta: {
          title: '促销数据',
          id: 'promotionRecord',
          type: 1,
          iframeUrl: ''
        },
      },
      {
        path: '/goods/goodsManage/goodsInfoTab',
        component: () => import('../page/goods/goodsManage/goodsInfoTab.vue'),
        meta: {
          title: '商品详情',
          id: 'goodsInfo',
          type: 1,
          iframeUrl: ''
        },
      },
      {
        path: '/setting/freightSet/freightForm',
        component: () => import('../page/setting/freightSet/freightForm'),
        meta: {
          title: '运费模板详情',
          id: 'freightForm',
          type: 1,
          iframeUrl: ''
        },
      },
      {
        path: '/setting/emailMessage/emailTemplate',
        component: () => import('../page/setting/emailMessage/emailTemplate'),
        meta: {
          title: '邮件模板详情',
          id: 'emailTemplate',
          type: 1,
          iframeUrl: ''
        },
      },
      {
        path: '/setting/taskModule/taskInfo',
        component: () => import('../page/setting/taskModule/taskInfo'),
        meta: {
          title: '任务详情',
          id: 'taksInfo',
          type: 1,
          iframeUrl: ''
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
Router.prototype.push = function push (location, onResolve, onReject) {
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
