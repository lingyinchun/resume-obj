import request from '@/utils/request'
const api = '/mall-api/operation-m/m'

export default {
    // 创建任务
    addTask(params) {
        return request({
            url: api + '/emailTask/add',
            method: 'post',
            data: params,
        })
    },
    cancelSendEmailTem(id) {
        return request({
            url: api + '/emailTask/cancelSend/' + id,
            method: 'post'
        })
    },
    getTask(id) {
        return request({
            url: api + '/emailTask/get/' + id,
            method: 'get'
        })
    },
    queryTask(data) {
        return request({
            url: api + '/emailTask/query',
            method: 'post',
            data: data
        })
    },
    downTemp(id) {
        return request({
            url: api + '/emailTemplate/download/' + id,
            method: 'get',
            responseType: 'blob'
        })
    }
}
