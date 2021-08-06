import request from '@/utils/request'

export function getUserMenu(data) {
  return request({
    url: '/mall-api/user-m/m/sysResource/getUserMenu',
    method: 'get',
    data,
  })
}
