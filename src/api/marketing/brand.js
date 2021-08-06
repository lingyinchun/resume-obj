import request from '@/utils/request'

const api = '/mall-api/goods-m/m'

export function querylist(search) {
    return request({
        url: `${api}/brand/query`,
        method: 'post',
        data: search,
    })
}

export function getInfo(search) {
    return request({
        url: `${api}/brand/get/${search}`,
        method: 'get',
    })
}
