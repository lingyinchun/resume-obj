import request from '@/utils/request'

const url = '/mall-api/user-m/m/userIntegral'

//积分列表
export function getList(search) {
  return request({
    url: `${url}/queryUserIntegral`,
    method: 'post',
    data: search,
  })
}

//
export function queryUserIntegralRecord(search) {
  return request({
    url: `${url}/queryUserIntegralRecord`,
    method: 'post',
    data: search,
  })
}

//发放成长值
export function addIntegral(search) {
  return request({
    url: `${url}/add`,
    method: 'post',
    data: search,
  })
}
