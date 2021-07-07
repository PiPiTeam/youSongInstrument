import request from '@/utils/request'

// 获取路由
export const getRouters = () => {
  const userData = {
    uuid: localStorage.getItem('uuid')
  }
  return request({
    url: 'sysMenu/getUserMenuTree',
    method: 'get',
    params: userData
  })
}
