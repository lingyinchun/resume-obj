import request from '@/utils/request'
const marketing = '/mall-api/goods-m/m'

// 有 sku的商品
export function queryGoods(params) {
    return request({
        url: marketing + '/goodsSku/query',
        method: 'post',
        data: params,
    })
}

export function goodsQuery(params) {
    return request({
        url: marketing + '/goods/query',
        method: 'post',
        data: params,
    })
}

//添加商品
export function batchAdd(params) {
    return request({
        url: '/mall-api/mmc-m/m/marketingScope/batchAdd',
        method: 'post',
        data: params,
    })
}

//删除商品
export function deleteMark(params) {
    return request({
        url: '/mall-api/mmc-m/m/marketingScope/delete',
        method: 'post',
        data: params,
    })
}

//修改范围
export function changeScopeApi(params) {
    return request({
        url: '/mall-api/mmc-m/m/marketingScope/changeScope',
        method: 'get',
        params: params,
    })
}

//获取商品编码
export function getSkuCode(params) {
    return request({
        url: '/mall-api/mmc-m/m/marketingScope/getSkuCode',
        method: 'get',
        params: params,
    })
}

//获取已保存的商品
export function query(params) {
    return request({
        url: '/mall-api/mmc-m/m/marketingScope/query',
        method: 'post',
        data: params,
    })
}

//保存营销，从草稿修改为正常活动
export function saveMarketing(params) {
    return request({
        url: '/mall-api/mmc-m/m/marketingScope/saveMarketing',
        method: 'get',
        params: params,
    })
}

export function downTemp(dictKey) {
    return request({
        url: `/mall-api/mmc-m/m/dictionary/getByDictKey/${dictKey}`,
        method: 'get',
    })
}

//获取已保存的类目id
export function getGoodsCategoryId(params) {
    return request({
        url: '/mall-api/mmc-m/m/marketingScope/getGoodsCategoryId',
        method: 'get',
        params: params,
    })
}
