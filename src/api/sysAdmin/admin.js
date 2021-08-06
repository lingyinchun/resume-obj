import request from '@/utils/request'

export function clearLoginStatus(s, token) {
  return request({
    url: `/mall-api/user-m/m/sysAdmin/clearLoginStatus?systemPlatform=${s}&token=${token}`,
    method: 'post',
    data: {},
  })
}