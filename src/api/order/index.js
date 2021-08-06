import request from '@/utils/request'
const order = '/mall-api/order-m/m'

export function orderQuery(params) {
  return request({
    url: order + '/order/query',
    method: 'post',
    data: params,
  })
}

export function getOrderStatus() {
  return request({
    url: order + '/dictionary/getOrderStatus',
    method: 'get',
  })
}

export function getOrder(id) {
  return request({
    url: order + `/order/get/${id}`,
    method: 'get',
  })
}

export function orderPayGet(orderCode) {
  return request({
    url: order + `/orderPay/get/${orderCode}`,
    method: 'get',
  })
}
