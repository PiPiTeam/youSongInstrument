import request from '@/utils/request'

export function getUserList(params) {
  return request({
    url: '/user/page-list',
    method: 'get',
    params
  })
}

// 根据用户id查询信息
export function getUserById(id) {
  return request({
    url: `/user/${id}`,
    method: 'get'
  })
}

// 修改用户审核状态
export function changeUserStatus(data) {
  return request({
    url: '/user/audit_status/',
    method: 'put',
    data
  })
}

// 修改用户服务状态
export function changeEnableStatus(data) {
  return request({
    url: '/user/enable_status/',
    method: 'put',
    data
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
