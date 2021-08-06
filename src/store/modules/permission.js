import {constantRoutes, endRoutes} from '@/router'
import Layout from '@/components/common/Home.vue'
import {getUserMenu} from '@/api/router'
// import { getUserMenu } from '@/api/index'
import {deepClone} from '@/utils/util'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
/* function hasPermission(roles, route) {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta.roles.includes(role))
  } else {
    return true
  }
} */

const state = {
    routes: [],
    isRoutes: false,
    pageLoading: false,
    tagsList: []
    // addRoutes: []
}

const mutations = {
    SET_ROUTES: (state, routes) => {
        // state.addRoutes = routes
        state.routes = routes
    },
    SET_ISROUTES: (state, flag) => {
        // state.addRoutes = routes
        state.isRoutes = flag
    },
    SET_PAGELOADING: (state, flag) => {
        // state.addRoutes = routes
        // console.log('SET_PAGELOADING'+ flag)
        state.pageLoading = flag
    },
    SET_TAGSLIST: (state, list) => {
        state.tagsList = list
    },
    RESETPERMISSION: (state, list) => {
        state.routes = []
        state.isRoutes = false
        state.routes = false
        state.tagsList = []
    }
}

const actions = {
    resetPermission({commit}, flag) {
        commit('RESETPERMISSION')
    },
    setPageLoading({commit}, flag) {
        commit('SET_PAGELOADING', flag)
    },
    generateRoutes({commit}, roles) {
        return new Promise((resolve, reject) => {
            getUserMenu()
                .then(res => {
                    // return ;
                    // const detail = { ...res.data }
                    let data = res.data
                    let data2 = deepClone(data)

                    let accessedRoutes = filterAsyncRoutes([]) //路由列表
                    accessedRoutes = accessedRoutes.concat(endRoutes)
                    commit('SET_ROUTES', data2) //菜单列表
                    commit('SET_ISROUTES', true)
                    resolve(accessedRoutes)
                })
                .catch((error) => {
                    console.log('1111')
                    reject(error)
                })
        })
    },
    changeIsRouter({commit}, state) {
        commit('SET_ISROUTES', state)
    },
    closeAllTagList({commit}, state) {
        commit('SET_TAGSLIST', [])
    },
    closeTags({commit, state}, index) {
        return new Promise(function (resolve, reject) {
            let tagsList = state.tagsList
            const delItem = tagsList.splice(index, 1)[0]
            resolve(state.tagsList)
        })
    },
    closeTagsByPath({commit, state}, path) {
        // console.log('path', path, state)
        return new Promise(function (resolve, reject) {
            let tagsList = state.tagsList
            const index = tagsList.findIndex((v)=>{ return v.path.indexOf(path) > -1})
            const delItem = tagsList.splice(index, 1)[0]
            resolve(state.tagsList)
        })
    },
    setTags({commit, state}, route) {
        return new Promise(function (resolve, reject) {
            let tagsList = state.tagsList
            const isExist = tagsList.some(item => {
                return item.path === route.fullPath
            })
            if (!isExist) {
                const isId = tagsList.some(item => {
                    return item.id === route.meta.id && item.path.indexOf('?') > 0
                })
                //如果存在当前路由的标签
                if (isId) {
                    const curItem = tagsList.findIndex(item => {
                        return item.id === route.meta.id
                    })
                    tagsList.splice(curItem, 1)
                }
                if (tagsList.length >= 8) {
                    tagsList.shift()
                }
                tagsList.push({
                    title: route.meta.title,
                    path: route.fullPath,
                    id: route.meta.id,
                    type: route.meta.type,
                    iframeUrl: route.meta.iframeUrl
                    // name: route.matched[1].components.default.name
                })
                commit('SET_TAGSLIST', tagsList)
            }
            resolve('200')
        })
    },
    closeOther({commit, state}, fullPath) {
        return new Promise(function (resolve, reject) {
            let tagsList = state.tagsList
            const curItem = tagsList.filter(item => {
                return item.path === fullPath
            })
            tagsList = curItem
            commit('SET_TAGSLIST', tagsList)
            resolve(tagsList)
        })
    }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes routes
 */
export const filterAsyncRoutes = (asyncRoutes, pUrl) => {
    const res = []
    if (asyncRoutes && asyncRoutes.length > 0) {
        asyncRoutes.forEach((item) => {
            let route = {
                path: item.url || '/',
                // component: item.parentId === 0 ? Layout : loadView(item.url),
                meta: {
                    title: item.resourceName,
                    noCache: true,
                    type: item.resourceType,
                    id: item.id,
                    iframeUrl: item.url
                },
                name: item.resourceName
            }
            if (item.resourceType != 3) {
                // 一级目录
                if (item.parentId === 0 && !item.childCategoryList) {
                    const route2 = deepClone(route)
                    route.component = Layout
                    route2.component = loadView(item.url)
                    route.children = [(route2)]
                } else {
                    route.component = item.parentId === 0 ? Layout : loadView(item.url)
                }
            } else {
                route.path = `${pUrl}/page-${item.id}`
                route.component = null
            }

            // console.log('加载路由', route)
            if (item.childCategoryList && item.childCategoryList.length) {
                route.children = filterAsyncRoutes(item.childCategoryList, item.url)
            }
            res.push(route)
        })
    }
    return res
}

/**
 * 路由懒加载
 */
export const loadView = (view) => {
    // webpack4中动态import不支持变量方式
    // return () => import(view)
    // return (resolve, reject) => require([`@/components${view}`], resolve)
    return (resolve, reject) => require([`@/page${view}`], resolve)
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
