import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/registered',
    component: () => import('@/views/registered/index'),
    name: 'registered',
    hidden: true
  },
  {
    path: '/resetPassword',
    component: () => import('@/views/login/resetPassword'),
    name: 'resetPassword',
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '主页', icon: 'dashboard' }
    }]
  },
  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/banner',
    children: [{
      path: 'banner',
      name: 'Banner',
      component: () => import('@/views/banner/index'),
      meta: { title: '轮播图', icon: 'dashboard' }
    }, {
      path: 'student-elegant-demeanor',
      name: 'studentElegantDemeanor',
      component: () => import('@/views/studentElegantDemeanor/index'),
      meta: { title: '学员风采', icon: 'dashboard' }
    }, {
      path: 'shopintroduction',
      name: 'ShopIntroduction',
      component: () => import('@/views/shopIntroduction/index'),
      meta: { title: '店铺介绍', icon: 'dashboard' }
    }, {
      path: 'best-selling-goods',
      name: 'bestSellingGoods',
      component: () => import('@/views/bestSellingGoods/index'),
      meta: { title: '热销产品', icon: 'dashboard' }
    }, {
      path: 'popular-courses',
      name: 'popularCourses',
      component: () => import('@/views/popularCourses/index'),
      meta: { title: '热门课程', icon: 'dashboard' }
    }, {
      path: 'shop-address',
      name: 'shopAddress',
      component: () => import('@/views/shopAddress/index'),
      meta: { title: '店铺地址', icon: 'dashboard' }
    }]
  },
  {
    path: '/newActivity',
    component: Layout,
    redirect: '/newActivity/newActivity',
    children: [{
      path: 'newActivity',
      name: 'NewActivity',
      component: () => import('@/views/newActivity/index'),
      meta: { title: '最新活动', icon: 'dashboard' }
    }]
  },
  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  }
  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
