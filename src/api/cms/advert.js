import request from '@/utils/request'
const cms = '/mall-api/cms-m/m'

export function advertQuery(params) {
  return request({
    url: cms + '/advert/query',
    method: 'post',
    data: params,
  })
}

export function advertDelete(id) {
  return request({
    url: cms + `/advert/delete/${id}`,
    method: 'post',
  })
}

export function advertAdd(params) {
  return request({
    url: cms + '/advert/add',
    method: 'post',
    data: params,
  })
}

export function advertUpdate(params) {
  return request({
    url: cms + '/advert/update',
    method: 'post',
    data: params,
  })
}

export function advertGet(id) {
  return request({
    url: cms + `/advert/get/${id}`,
    method: 'get',
  })
}
