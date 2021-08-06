import request from '@/utils/request'

export function getList(search) {
  return request({
    url: '/mall-api/user-m/m/sysUser/query',
    method: 'post',
    data: search,
  })
}

export function getUserById(id) {
  return request({
    url: '/mall-api/user-m/m/sysUser/get/' + id,
    method: 'get',
  })
}

export function saveUser(data) {
  return request({
    url: '/mall-api/user-m/m/sysUser/add',
    method: 'post',
    data: data
  })
}

export function updateUser(data) {
  return request({
    url: '/mall-api/user-m/m/sysUser/update',
    method: 'post',
    data: data
  })
}

export function updateUserPwd(data) {
  return request({
    url: '/mall-api/user-m/m/sysUser/updatePwd',
    method: 'post',
    data: data
  })
}

export function deleteUser(ids) {
  return request({
    url: '/mall-api/user-m/m/sysUser/delete/' + ids,
    method: 'post',
  })
}

export function statusUser(ids, status) {
  return request({
    url: '/mall-api/sysUser/set-status',
    method: 'post',
    params: {
      ids: ids,
      status: status,
    },
  })
}

export function saveOrUpdateUser(data) {
  return request({
    url: '/mall-api/sysUser/set',
    method: 'post',
    data: data,
  })
}

export function savePwdUser(data) {
  return request({
    url: '/mall-api/sysUser/set-password',
    method: 'post',
    params: {
      id: data.id,
      password: data.password,
    },
  })
}

export function exportUser() {
  return request({
    url: '/mall-api/sysUser/export',
    method: 'post',
    responseType: 'blob',
  })
}
