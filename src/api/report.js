import request from '@/utils/request'

// 上架商品报表
export function goodsShelves(year,type) {
    return request({
        url: `/mall-api/goods-m/m/report/goodsShelves/${year}/${type}`,
        method: 'get',
    })
}

// 活跃用户数
export function activeUsers(year) {
    return request({
        url: `/mall-api/user-m/m/report/activeUsers/${year}`,
        method: 'get',
    })
}
