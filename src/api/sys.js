import request from '@/utils/request'

export function getSysList(params) {
  return request({
    url: 'sysRole/pageList',
    method: 'get',
    params
  })
}

export function getAllMenuTree(params) {
  return request({
    url: 'sysRole/getAllMenuTree',
    method: 'get',
    params
  })
}

export function deleteByIds(ids) {
  return request({
    url: 'sysRole/delete?roleId=' + ids,
    method: 'delete'
  })
}

export function enableRole(data) {
  return request({
    url: 'sysRole/enable?roleId=' + data,
    method: 'put'
  })
}

export function disableRole(data) {
  return request({
    url: 'sysRole/disable?roleId=' + data,
    method: 'put'
  })
}

export function findRoleMenus(params) {
  return request({
    url: 'sysRole/findRoleMenus',
    method: 'get',
    params
  })
}

export function findMenusByRoleId(params) {
  return request({
    url: 'sysRole/findMenusByRoleId',
    method: 'get',
    params
  })
}

export function addRole(data) {
  return request({
    url: 'sysRole/addRole',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: 'sysRole/updateRole',
    method: 'put',
    data
  })
}
