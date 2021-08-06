import request from '@/utils/request'
const api = '/mall-api/operation-m/m'

export default {
    // 创建 编辑邮件模版
    addOrUpdate(params) {
        return request({
            url: api + '/emailTemplate/addOrUpdate',
            method: 'post',
            data: params,
        })
    },
    deleteEmailTem(id) {
        return request({
            url: api + '/emailTemplate/delete/' + id,
            method: 'post'
        })
    },
    getEmailTem(id) {
        return request({
            url: api + '/emailTemplate/get/' + id,
            method: 'get'
        })
    },
    queryEmailTem(data) {
        return request({
            url: api + '/emailTemplate/query',
            method: 'post',
            data: data
        })
    },
    queryEmailRecord(data) {
        return request({
            url: api + '/emailRecord/query',
            method: 'post',
            data: data
        })
    }
}
