import request from '@/utils/request'

const url = '/mall-api/user-m/m/sysResource/'
export function getList(data) {
  return request({
    url: `${url}getTree`,
    method: 'get',
    params: data
  })
}

export function saveMenu(data) {
  return request({
    url: `${url}add`,
    method: 'post',
    data: data,
  })
}

export function updateMenu(data) {
  return request({
    url: `${url}update`,
    method: 'post',
    data: data,
  })
}

export function deleteMenu(ids) {
  return request({
    url: `${url}delete/${ids}`,
    method: 'post',
    params: {
      ids: ids,
    },
  })
}

export function getSysMenuById(id) {
  return request({
    url: `${url}get/${id}`,
    method: 'get'
  })
}

export function getRoutes() {
  return request({
    url: '/mate-system/menu/tree',
    method: 'get',
  })
}

export function getAsyncList() {
  return request({
    url: '/mate-system/menu/grade',
    method: 'get',
  })
}

export function statusMenu(ids, status) {
  return request({
    url: '/mate-system/menu/set-status',
    method: 'post',
    params: {
      ids: ids,
      status: status,
    },
  })
}

export function exportMenu() {
  return request({
    url: '/mate-system/menu/export',
    method: 'post',
    responseType: 'blob',
  })
}
