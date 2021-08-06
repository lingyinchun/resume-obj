import request from '@/utils/request'

export function getRoleList(search) {
  return request({
    url: '/mall-api/user-m/m/sysRole/query',
    method: 'post',
    data: search,
  })
}

export function saveRole(data) {
  return request({
    url: '/mall-api/user-m/m/sysRole/add',
    method: 'post',
    data: data,
  })
}

export function updateRole(data) {
  return request({
    url: '/mall-api/user-m/m/sysRole/update',
    method: 'post',
    data: data,
  })
}

export function getRoleById(id) {
  return request({
    url: `/mall-api/user-m/m/sysRole/get/${id}`,
    method: 'get',
  })
}

export function deleteRole(id) {
  return request({
    url: `/mall-api/user-m/m/sysRole/delete/${id}`,
    method: 'post',
  })
}

export function exportRole() {
  return request({
    url: '/mall-api/sysRole/export',
    method: 'post',
    responseType: 'blob',
  })
}
