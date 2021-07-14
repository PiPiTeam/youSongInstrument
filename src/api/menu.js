import request from '@/utils/request'

// 获取路由
export const getRouters = () => {
  const userData = {
    userId: localStorage.getItem('youSongUserId')
  }
  return request({
    url: '/menu/getMenuTreeByUserId',
    method: 'get',
    params: userData
  })
}
