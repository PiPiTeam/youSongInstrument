import request from '@/utils/request'

export function getShopList(params) {
  return request({
    url: '/store/list/under-cur-user',
    method: 'get',
    params
  })
}

// 新增
export function addStore(data) {
  return request({
    url: '/store',
    method: 'post',
    data
  })
}

// 更新
export function updateStore(data) {
  return request({
    url: '/store',
    method: 'put',
    data
  })
}
