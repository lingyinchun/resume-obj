import request from '@/utils/request'
const cms = '/mall-api/cms-m/m'

export function advertSpaceQuery(params) {
  return request({
    url: cms + '/advertSpace/query',
    method: 'post',
    data: params,
  })
}

export function advertSpaceAdd(params) {
  return request({
    url: cms + '/advertSpace/add',
    method: 'post',
    data: params,
  })
}

export function advertSpaceUpdate(params) {
  return request({
    url: cms + '/advertSpace/update',
    method: 'post',
    data: params,
  })
}

export function advertSpaceGet(id) {
  return request({
    url: cms + `/advertSpace/get/${id}`,
    method: 'get',
  })
}

export function advertSpacePages() {
  return request({
    url: cms + `/dictionary/get/CMS_ADVERT_SPACE_PAGE`,
    method: 'get',
  })
}
