import request from '@/utils/request'
import { getUserNo } from '@/utils/auth'

export function loginByUsername(userName, password, code, token, key) {
  const data = {
    account: userName,
    pwd: password
  }
  // 登录
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

export function refreshToken() {
  const userData = {
    userNo: getUserNo()
  }
  return request({
    url: 'refreshToken',
    method: 'post',
    params: userData
  })
}

// 登出
export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}

export function getUserInfo() {
  const user = {
    userNo: getUserNo()
  }
  return request({
    url: 'getRolesByUserNo',
    method: 'get',
    params: user
  })
}
// 注册
export function getRegistered(params) {
  return request({
    url: '/registered',
    method: 'post',
    data: params
  })
}
// 发送验证码
export function getSendVerificationCode(params) {
  return request({
    url: '/email/sendVerificationCode',
    method: 'post',
    data: params
  })
}
// 重置密码
export function getResetPassword(params) {
  return request({
    url: '/sysUser/resetPassword',
    method: 'post',
    data: params
  })
}
