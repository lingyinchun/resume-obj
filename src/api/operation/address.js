import request from '@/utils/request'
const operation = '/mall-api/operation-m/m'

export function getByParentCode(code) {
  return request({
    url: operation + `/address/getByParentCode/${code}`,
    method: 'get',
  })
}