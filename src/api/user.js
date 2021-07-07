import request from '@/utils/request'

export function getUserList(params) {
  return request({
    url: '/sysUser/pageList',
    method: 'get',
    params
  })
}
// 用户审核
export function getReviewUserList(params) {
  return request({
    url: '/sysUser/getReviewUser',
    method: 'get',
    params
  })
}

export function getreviewUser(params) {
  return request({
    url: '/sysUser/reviewUser',
    method: 'put',
    data: params
  })
}

// 删除
export function deleteUser(params) {
  return request({
    url: '/sysUser/delete/',
    method: 'delete',
    params
  })
}

// 新增
export function addUser(data) {
  return request({
    url: '/sysUser/addUser/',
    method: 'post',
    data
  })
}

// 更新
export function updateUser(data) {
  return request({
    url: '/sysUser/updateUser/',
    method: 'put',
    data
  })
}
