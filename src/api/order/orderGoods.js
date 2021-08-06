import request from '@/utils/request'
const order = '/mall-api/order-m/m'

export function orderGoodsQuery(params) {
  return request({
    url: order + '/orderGoods/query',
    method: 'post',
    data: params,
  })
}