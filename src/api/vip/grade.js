import request from '@/utils/request'

export function getList(search) {
  return request({
    url: '/mall-api/user-m/m/userLevel/query',
    method: 'post',
    data: search,
  })
}

export function getById(id) {
  return request({
    url: '/mall-api/user-m/m/userLevel/get/' + id,
    method: 'get',
  })
}

export function save(data) {
  return request({
    url: '/mall-api/user-m/m/userLevel/add',
    method: 'post',
    data: data
  })
}

export function update(data) {
  return request({
    url: '/mall-api/user-m/m/userLevel/update',
    method: 'post',
    data: data
  })
}

export function deleteItem(ids) {
  return request({
    url: '/mall-api/user-m/m/userLevel/delete/' + ids,
    method: 'post',
  })
}