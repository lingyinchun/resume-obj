import request from '@/utils/request';

export async function loginByUsername(data) {
  return request({
    url: '/mall-api/user-m/m/sysUser/login',
    method: 'post',
    data: {
      userName: data.username,
      userPwd: data.password,
    },
    headers: {
      'key': data.key,
      'code': data.code
    }
  })
}

export function getInfo(id) {
  return request({
    url: '/mall-api/user-m/m/sysUser/get/' + id,
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/mall-api/user-m/m/sysUser/logout',
    method: 'post',
  })
}

export function getCode() {
  return request({
    url: '/mall-api/user-m/m/sysUser/code',
    method: 'post',
  })
}

export function getPlatformList() {
  return request({
    url: '/mall-api/user-m/m/sysUser/getPlatformList',
    method: 'get',
  })
}
