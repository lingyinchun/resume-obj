import request from '@/utils/request'

const api = '/mall-api/goods-m/m'

export function querylist(search) {
    return request({
        url: `${api}/attribute/query`,
        method: 'post',
        data: search,
    })
}

export function getInfo(id) {
    return request({
        url: `${api}/attribute/get/${id}`,
        method: 'get',
    })
}

export function updateData(search) {
    return request({
        url: `${api}/attribute/update`,
        method: 'post',
        data: search,
    })
}
