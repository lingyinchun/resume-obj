import request from '@/utils/request'
const operation = '/mall-api/operation-m/m'

export function userDownloadQuery(search) {
  return request({
    url: operation + '/userDownload/query',
    method: 'post',
    data: search,
  })
}