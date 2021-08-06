import request from '@/utils/request'

const api = '/mall-api/mmc-m/m'

export function querylist(search) {
    return request({
        url: `${api}/promotion/query`,
        method: 'post',
        data: search,
    })
}

export function add(search) {
    return request({
        url: `${api}/promotion/add`,
        method: 'post',
        data: search,
    })
}

export function getById(id) {
    return request({
        url: `${api}/promotion/get/${id}`,
        method: 'get'
    })
}

export function update(search) {
    return request({
        url: `${api}/promotion/update`,
        method: 'post',
        data: search,
    })
}

export function closeAct(id) {
    return request({
        url: `${api}/promotion/closedPromotion/${id}`,
        method: 'get',
    })
}

// 活动明细统计
export function getPromotionCount(data) {
    return request({
        url: `${api}/promotion/getPromotionCount`,
        method: 'post',
        data: data
    })
}

// 活动数据
export function queryPromotiontail(data) {
    return request({
        url: `${api}/promotion/queryPromotiontail`,
        method: 'post',
        data: data
    })
}
