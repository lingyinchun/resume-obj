import request from '@/utils/request';
// //mock 数据
export const fetchData = query => {
    return request({
        url: './table.json',
        method: 'get',
        params: query
    });
};
//
// export const getUserMenu = query => {
//     return request({
//         url: './route.json',
//         method: 'get',
//         params: query
//     });
// };

export function uploadFile(url, data) {
    return request({
        url: url,
        method: 'post',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: data
    })
}
