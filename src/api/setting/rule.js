import request from '@/utils/request'
const user = '/mall-api/user-m/m'
const order = '/mall-api/order-m/m'

export function setDictionary(params) {
  return request({
    url: user + '/dictionary/setDictionary',
    method: 'post',
    data: params,
  })
}

export function setOrderDictionary(params) {
  return request({
    url: order + '/dictionary/setDictionary',
    method: 'post',
    data: params,
  })
}

// 获取成长值规则
export function getUserGrowth() {
  return request({
    url: user + '/dictionary/getUserGrowth',
    method: 'get',
  })
}

// 获取积分规则
export function getUserIntegral() {
  return request({
    url: user + '/dictionary/getUserIntegral',
    method: 'get',
  })
}

// 获取订单时效
export function getOrderAging() {
  return request({
    url: order + '/dictionary/getOrderAging',
    method: 'get',
  })
}

//前台类目设置
export function dictionaryGet(key) {
  return request({
    url: '/mall-api/goods-m/m/dictionary/get/' + key,
    method: 'get',
  })
}

//前台类目设置
export function saveCategory(data) {
  return request({
    url: '/mall-api/goods-m/m/dictionary/saveCategory',
    method: 'post',
    data: data
  })
}

//前台类目设置
export function getPrivacyPolicyAndServiceAgreement() {
  return request({
    url: '/mall-api/user-m/m/dictionary/getPrivacyPolicyAndServiceAgreement',
    method: 'get'
  })
}

