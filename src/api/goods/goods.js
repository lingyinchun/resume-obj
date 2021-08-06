import request from '@/utils/request'
const goods = '/mall-api/goods-m/m'

export function queryGoods(params) {
    return request({
        url: `${goods}/goodsSku/query`,
        method: 'post',
        data: params,
    })
}

export function getGoodsInfo(id) {
    return request({
        url: `${goods}/goodsSku/get/${id}`,
        method: 'get',
    })
}

export function getAttribute(skuCode) {
    return request({
        url: `${goods}/goodsSku/getAttribute/${skuCode}`,
        method: 'get',
    })
}

export function getDescription(skuCode) {
    return request({
        url: `${goods}/goodsSku/getDescription/${skuCode}`,
        method: 'get',
    })
}

// 上架商品报表
export function goodsShelves() {
    return request({
        url: `${goods}/report/goodsShelves`,
        method: 'get',
    })
}
