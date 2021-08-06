import request from '@/utils/request'

export function querylist(search) {
    return request({
        url: '/mall-api/mmc-m/m/coupon/query',
        method: 'post',
        data: search,
    })
}

export function getById(id) {
    return request({
        url: `/mall-api/mmc-m/m/coupon/get/${id}`,
        method: 'get'
    })
}

export function add(search) {
    return request({
        url: '/mall-api/mmc-m/m/coupon/add',
        method: 'post',
        data: search,
    })
}

export function update(search) {
    return request({
        url: '/mall-api/mmc-m/m/coupon/update',
        method: 'post',
        data: search,
    })
}

// 优惠券使用数量
export function getCouponTakeCount(data) {
    return request({
        url: `/mall-api/mmc-m/m/coupon/getCouponTakeCount/${data.couponId}`,
        method: 'post',
        data: data
    })
}

// 优惠券使用明细
export function queryCouponDetail(data) {
    return request({
        url: `/mall-api/mmc-m/m/coupon/queryCouponDetail`,
        method: 'post',
        data: data
    })
}

// 优惠券关闭
export function closedCoupon(id) {
    return request({
        url: `/mall-api/mmc-m/m/coupon/closedCoupon/${id}`,
        method: 'get'
    })
}
