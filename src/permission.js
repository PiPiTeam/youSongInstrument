import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import { getRouters } from '@/api/menu'

NProgress.configure({ showSpinner: false })

const whiteList = ['/login', '/registered', '/resetPassword', '/setting', '/setting/banner', '/newActivity/newActivity']

router.beforeEach(async(to, from, next) => {
  NProgress.start()
  if (getToken()) {
    /* has token*/
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      const permissionRoutes = store.getters.permission_routes
      const { length, last = length - 1 } = permissionRoutes
      const hasMenu = permissionRoutes && permissionRoutes[last] && permissionRoutes[last].path === '*'
      if (hasMenu) {
        next()
      } else {
        try {
          // 判断当前用户是否已拉取完user_info信息
          const { data } = await getRouters()
          const routerArr = data.data
          const accessRoutes = await store.dispatch('createRoutes', routerArr)
          router.addRoutes(accessRoutes) // 动态添加可访问路由表
          await store.dispatch('updataPermissions', data.data)
          next({ ...to, replace: true }) // hack方法 确保addRoutes已完成
        } catch (error) {
          Message({
            message: error || 'Error',
            dangerouslyUseHTMLString: true,
            type: 'error',
            duration: 5 * 1000
          })
          store.dispatch('Logout').then(() => {
            // Message.error(err)
            next({ path: '/' })
          })
          // next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    // 没有token
    if (whiteList.indexOf(to.path) !== -1) {
      // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login`) // 否则全部重定向到登录页 ?redirect=${to.path}
      NProgress.done()
    }
  }
})

router.afterEach((to) => {
  // 动态获取route.meta.permissions
  // store.dispatch('updataPermissions', to.meta.permissions)
  NProgress.done()
})
