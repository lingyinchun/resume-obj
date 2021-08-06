/**
 * @description
 */

import Vue from 'vue'
import {
  loginByUsername,
  logout,
} from '@/api/user'
import {
  getSessionId,
  removeSessionId,
  setSessionId,
} from '@/utils/SessionId'
import { resetRouter } from '@/router'


const state = {
  sessionId: '',
  username: '',
  avatar: '',
  permissions: [],
  userInfo: {},
  id: '',
}

const mutations = {
  resetUser(state) {
    state.sessionId = ''
    state.username = ''
    state.avatar = ''
    state.permissions = []
    state.userInfo = {}
    state.id = ''
  },
  setSessionId(state, sessionId) {
    state.sessionId = sessionId
    setSessionId(sessionId)
  },
  setId(state, id) {
    state.id = id
  },
  setUsername(state, username) {
    state.username = username
  },
  setAvatar(state, avatar) {
    state.avatar = avatar
  },
  setPermissions(state, permissions) {
    state.permissions = permissions
  },
  setUserInfo(state, info) {
    state.userInfo = info
  },
}

const actions = {
  setPermissions({ commit }, permissions) {
    commit('setPermissions', permissions)
  },
  /**
   * 根据用户名登录
   * @param {*} param
   * @param {*} userInfo
   */
  async loginByUsername({ commit }, userInfo) {
    const { data } = await loginByUsername(userInfo)
    console.log('data====',data)
    const sessionId = data.token
    const id = data.id
    commit('setUserInfo', data)
    sessionStorage.setItem('userId', id)
    localStorage.setItem('userInfo', JSON.stringify(data))
    if (sessionId) {
      commit('setSessionId', sessionId)
      commit('setId', id)
      commit('setPermissions', ['sys:menu:down'])

      const hour = new Date().getHours()
      const thisTime =
        hour < 8
          ? '早上好'
          : hour <= 11
          ? '上午好'
          : hour <= 13
          ? '中午好'
          : hour < 18
          ? '下午好'
          : '晚上好'
      Vue.prototype.$baseNotify(`欢迎登录`, `${thisTime}！`)
    }
  },

  /**
   * 社交登录
   * @param {*} param0
   * @param {*} userInfo
   */
  loginBySocial({ commit }, userInfo) {
    const { code, state } = userInfo
    console.log('社交登录，loginBySocial')
    return null
    // return new Promise((resolve, reject) => {
    //   loginBySocialApi({ state: state, code: code })
    //     .then((response) => {
    //       const { data } = response
    //       // console.log(data)
    //       commit('SET_TOKEN', data.sessionId)
    //       commit('SET_ID', data.id)
    //       const hour = new Date().getHours()
    //       const thisTime =
    //         hour < 8
    //           ? '早上好'
    //           : hour <= 11
    //           ? '上午好'
    //           : hour <= 13
    //           ? '中午好'
    //           : hour < 18
    //           ? '下午好'
    //           : '晚上好'
    //       Vue.prototype.$baseNotify(`欢迎登录`, `${thisTime}！`)
    //       resolve()
    //     })
    //     .catch((error) => {
    //       reject(error)
    //     })
    // })
  },
  async logout({ commit, dispatch }) {
    sessionStorage.removeItem('userId')
    localStorage.removeItem('userInfo')
    commit('resetUser')
    dispatch('permission/resetPermission', false, { root: true })
    await logout()
    removeSessionId()
    await resetRouter()
  }
}
export default { namespaced: true, state, mutations, actions }
