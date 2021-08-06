import request from '@/utils/request'
const api = '/mall-api/order-m/m'

export default {
    freightTemplateAdd(params) {
        return request({
            url: api + '/freightTemplate/add',
            method: 'post',
            data: params,
        })
    },
    freightTemplateDel(id) {
        return request({
            url: `${api}/freightTemplate/delete/${id}`,
            method: 'post'
        })
    },
    freightTemplateGet(id) {
        return request({
            url: `${api}/freightTemplate/get/${id}`,
            method: 'get'
        })
    },
    freightTemplateQuery(params) {
        return request({
            url: `${api}/freightTemplate/query`,
            method: 'post',
            data: params
        })
    },
    freightTemplateUpdate(params) {
        return request({
            url: `${api}/freightTemplate/update`,
            method: 'post',
            data: params
        })
    }
}
