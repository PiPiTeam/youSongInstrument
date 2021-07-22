import { constantRoutes } from '@/router'
import { getRouters } from '@/api/menu'
import Layout from '@/layout'
import NullRouterView from '@/layout/null-router-view'

const permission = {
  state: {
    routes: [],
    addRoutes: [],
    permissions: []
  },
  mutations: {
    SET_ROUTES: (state, routes) => {
      state.addRoutes = routes
      state.routes = constantRoutes.concat(routes)
    },
    SET_PERMISSIONS: (state, list) => {
      state.permissions = list
    }
  },
  actions: {
    // 生成路由
    GenerateRoutes({ commit }) {
      return new Promise(resolve => {
        // 向后端请求路由数据
        getRouters().then(res => {
          const accessedRoutes = recursionRoutesMap(res.data.data)
          // const accessedRoutes = filterAsyncRouter(res.data.data)
          commit('SET_ROUTES', accessedRoutes)
          resolve(accessedRoutes)
        })
      })
    },
    resetMapRouter({ commit }) {
      commit('SET_ROUTES', [])
    },
    updataPermissions({ commit }, list) {
      const btnPermission = filterPermissionBtn(list)
      commit('SET_PERMISSIONS', btnPermission)
    },
    createRoutes({ commit }, routes) {
      return new Promise(resolve => {
        const accessedRoutes = recursionRoutesMap(routes)
        // if (routes[0].url !== '/') {
        //   accessedRoutes.push({ path: '/', redirect: '/' + routes[0].childMenu[0].component, hidden: true })
        // } else if (routes[0].url === '/' && routes[0].childMenu[0].url === 'list') {
        //   accessedRoutes.push({ path: '/', redirect: '/list', hidden: true })
        // }
        if (routes[0].code === 'audit') {
          accessedRoutes.push({ path: '/', redirect: routes[0].url, hidden: true })
        }
        accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      })
    }
  }
}

export function recursionRoutesMap(routes) {
  const res = []
  console.log(routes)
  routes.forEach((route, index) => {
    const tmp = { ...route }
    //* menuType: 0 目录 1 页面 2 按钮
    if (tmp.menuType === 2) return

    if (route.childMenu && route.childMenu.length > 0) {
      tmp.children = recursionRoutesMap(route.childMenu)
      delete tmp.childMenu
    }

    if (tmp.status === 1) tmp.hidden = true
    if (tmp.url === '/' && tmp.menuType === 0 && routes[0].url === '/') tmp.redirect = '/' + routes[0].childMenu[0].url
    if (tmp.component) {
      // Layout组件特殊处理
      if (tmp.component === 'Layout') {
        tmp.component = Layout
      } else if (tmp.component === 'NullRouterView') {
        tmp.component = NullRouterView
      } else {
        console.log(loadView(tmp.component))
        tmp.component = loadView(tmp.component)
        console.log(tmp.component)
      }
    }
    // 转换数据
    tmp.path = tmp.url || '' + index
    tmp.meta = {
      title: tmp.name,
      icon: tmp.icon
    }
    delete tmp.url
    res.push(tmp)
  })
  return res
}

// 遍历后台传来的路由字符串，筛选按钮权限
function filterPermissionBtn(asyncRouterMap) {
  let res = []
  asyncRouterMap.map(route => {
    if (route.childMenu && route.childMenu.length > 0) {
      res = res.concat(filterPermissionBtn(route.childMenu))
    } else {
      res.push(route.code)
    }
  })
  return res
}

export const loadView = (view) => { // 路由懒加载
  // return () => import(`@/views/${view}`)
  return resolve => require([`@/views/${view}`], resolve)
}

export default permission
