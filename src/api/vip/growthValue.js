import request from '@/utils/request'

const url = '/mall-api/user-m/m/userGrowth'

//某个用户
export function getList(search) {
  return request({
    url: `${url}/query`,
    method: 'post',
    data: search,
  })
}

//所有用户
export function queryUserGrowth(search) {
  return request({
    url: `${url}/queryUserGrowth`,
    method: 'post',
    data: search,
  })
}

//发放成长值
export function addUserGrowth(search) {
  return request({
    url: `${url}/add`,
    method: 'post',
    data: search,
  })
}
