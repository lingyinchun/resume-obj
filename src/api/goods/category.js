import request from '@/utils/request'
const goods = '/mall-api/goods-m/m'

export function getRootGoodsCategory(params) {
  return request({
    url: goods + '/goodsCategory/getRootGoodsCategory',
    method: 'post',
    data: params,
  })
}

export function goodsCategoryAddOrUpdate(params) {
  return request({
    url: goods + '/goodsCategory/addOrUpdate',
    method: 'post',
    data: params,
  })
}

export function goodsCategoryUpdateStatus(params) {
  return request({
    url: goods + '/goodsCategory/updateStatus',
    method: 'post',
    data: params,
  })
}

export function goodsCategoryGet(id) {
  return request({
    url: goods + `/goodsCategory/get/${id}`,
    method: 'get',
  })
}

export function goodsCategoryDelete(id) {
  return request({
    url: goods + `/goodsCategory/delete/${id}`,
    method: 'post',
  })
}

export function getGoodsCategoryByParentId(id) {
  return request({
    url: goods + `/goodsCategory/getGoodsCategoryByParentId/${id}`,
    method: 'get',
  })
}
export function getBackgroundTree(id) {
  return request({
    url: goods + `/goodsCategory/getBackgroundTree`,
    method: 'get',
  })
}

export function goodsCategoryRelationAdd(data) {
  return request({
    url: goods + `/goodsCategoryRelation/add`,
    method: 'post',
    data: data
  })
}
export function goodsCategoryRelationGet(leftId) {
  return request({
    url: goods + `/goodsCategoryRelation/get/${leftId}`,
    method: 'get',
  })
}

export function goodsCategoryRelationDel(data) {
  return request({
    url: goods + `/goodsCategoryRelation/delete`,
    method: 'post',
    data: data
  })
}

//类目-商品关联
export function goodsCategoryGoodsAdd(data) {
  return request({
    url: goods + `/goodsCategoryGoods/add`,
    method: 'post',
    data: data
  })
}
//类目-商品关联删除
export function goodsCategoryGoodsDel(data) {
  return request({
    url: goods + `/goodsCategoryGoods/delete`,
    method: 'post',
    data: data
  })
}
//类目-商品id列表
export function goodsCategoryGoodsGet(leftId) {
  return request({
    url: goods + `/goodsCategoryGoods/get/${leftId}`,
    method: 'get',
  })
}
export function goodsCategoryGoodsQuery(params) {
  return request({
    url: goods + `/goodsCategoryGoods/query`,
    method: 'post',
    data: params
  })
}
