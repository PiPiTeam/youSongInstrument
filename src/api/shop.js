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

// 获取店铺简介
export function getIntro(id) {
  return request({
    url: `/store/${id}/intro`,
    method: 'get'
  })
}

// 更新店铺简介
export function setIntro(shopId, data) {
  return request({
    url: `/store/${shopId}/intro`,
    method: 'put',
    data
  })
}

// 添加店铺简介图片
export function addIntroImg(id, data) {
  return request({
    url: `/store/${id}/intro/image`,
    method: 'post',
    data
  })
}

// 删除店铺简介图片
export function deleteIntroImg(id, data) {
  return request({
    url: `/store/${id}/intro/image`,
    method: 'delete',
    data
  })
}

// 活动分页
export function getActivityPageList(params) {
  return request({
    url: `/activity/page-list`,
    method: 'get',
    params
  })
}

// 新建活动
export function addActivity(data) {
  return request({
    url: `/activity`,
    method: 'post',
    data
  })
}

// 修改活动 id
export function updataActivity(data) {
  return request({
    url: `/activity`,
    method: 'put',
    data
  })
}

// 删除活动ids
export function deleteActivity(params) {
  return request({
    url: `/activity`,
    method: 'delete',
    params
  })
}

// 查看活动
export function getActivityDetail(id) {
  return request({
    url: `/activity/${id}`,
    method: 'get'
  })
}

// 分页查询关注用户
export function getActivityFollowPageList(params) {
  return request({
    url: `/activity/follower/page-list`,
    method: 'get',
    params
  })
}

// 产品分页
export function getProductPageList(params) {
  return request({
    url: `/product/page-list`,
    method: 'get',
    params
  })
}

// 课程列表
export function getCoursePageList(params) {
  return request({
    url: `/course/list`,
    method: 'get',
    params
  })
}

// 新增课程
export function addCourse(data) {
  return request({
    url: `/course`,
    method: 'post',
    data
  })
}

// 添加课程图片
export function addCourseImg(id, data) {
  return request({
    url: `/course/${id}/image`,
    method: 'post',
    data
  })
}

// 修改课程图片
export function updataCourse(data) {
  return request({
    url: `/course`,
    method: 'put',
    data
  })
}

// 删除课程图片
export function deleteCourseImg(id, data) {
  return request({
    url: `/course/${id}/image`,
    method: 'delete',
    data
  })
}
