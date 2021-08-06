import request from '@/utils/request'

export function getList(search) {
  return request({
    url: '/mall-api/user-m/m/user/query',
    method: 'post',
    data: search,
  })
}

export function getUserById(id) {
  return request({
    url: '/mall-api/user-m/m/user/get/' + id,
    method: 'get',
  })
}

export function getUserMemberRights(id) {
  return request({
    url: '/mall-api/user-m/m/user/getUserMemberRights/' + id,
    method: 'post',
  })
}

export function saveUser(data) {
  return request({
    url: '/mall-api/user-m/m/user/add',
    method: 'post',
    data: data
  })
}

export function updateUser(data) {
  return request({
    url: '/mall-api/user-m/m/user/update',
    method: 'post',
    data: data
  })
}

export function updateStatus(id) {
  return request({
    url: `/mall-api/user-m/m/user/updateStatus/${id}`,
    method: 'post',
  })
}

export function saveOrUpdateUser(data) {
  return request({
    url: '/mall-api/user/set',
    method: 'post',
    data: data,
  })
}

export function savePwdUser(data) {
  return request({
    url: '/mall-api/user/set-password',
    method: 'post',
    params: {
      id: data.id,
      password: data.password,
    },
  })
}

export function exportUser() {
  return request({
    url: '/mall-api/user/export',
    method: 'post',
    responseType: 'blob',
  })
}
