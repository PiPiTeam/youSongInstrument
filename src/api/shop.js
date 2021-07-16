import request from '@/utils/request'

export function getShopList(params) {
  return request({
    url: '/store/list/under-cur-user',
    method: 'get',
    params
  })
}

// 新增店铺
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

export function getBannerList(id) {
  return request({
    url: `/store/${id}/banner/list`,
    method: 'get'
  })
}

// 新增banner
export function addBanner(shopId, data) {
  return request({
    url: `/store/${shopId}/banner`,
    method: 'post',
    data
  })
}

// 删除banner fileIds
export function deleteBanner(shopId, data) {
  return request({
    url: `/store/${shopId}/banner`,
    method: 'delete',
    data
  })
}

