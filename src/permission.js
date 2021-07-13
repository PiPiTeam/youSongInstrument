import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import { getToken } from '@/utils/auth'
import { getRouters } from '@/api/menu'

NProgress.configure({ showSpinner: false })

const whiteList = [
  '/login', '/registered', '/resetPassword',
  '/banner/banner', '/shopintroduction/shopintroduction', '/student-elegant-demeanor/student-elegant-demeanor',
  '/best-selling-goods/best-selling-goods', '/popular-courses/popular-courses', '/shop-address/shop-address',
  '/newActivity/newActivity', 'newActivity/add'
]

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
          // const { data } = await getRouters()
          const data = {
            code: '10000',
            data: [
              {
                childMenu: [
                  {
                    childMenu: [
                      {
                        childMenu: [],
                        code: 'view:task',
                        component: '',
                        icon: '',
                        menuCode: 'menu-335d7dc88fb94c889b78c6d5faf34789',
                        menuId: 66,
                        menuType: 2,
                        name: '查看任务',
                        num: 0,
                        parentId: 30,
                        status: 0,
                        url: ''
                      }
                    ],
                    code: 'img:personal',
                    component: 'dashboard',
                    icon: 'dashboard',
                    menuCode: 'menu-f846d436c9fa45ddb2ca4783b949d03a',
                    menuId: 30,
                    menuType: 1,
                    name: '个人主页',
                    num: 0,
                    parentId: 27,
                    status: 0,
                    url: 'dashboard'
                  }
                ],
                code: 'img:personal:layout',
                component: 'Layout',
                icon: 'dashboard',
                menuCode: 'menu-39881f81fc8e4183ab59e8b250d3b6d1',
                menuId: 27,
                menuType: 0,
                name: '主页',
                num: 0,
                status: 1,
                url: '/'
              },
              {
                childMenu: [
                  {
                    childMenu: [],
                    code: 'banner',
                    component: 'banner',
                    icon: 'menu',
                    menuCode: 'menu-59e41ddde8d1466d833ff24562db4726',
                    menuId: 33,
                    menuType: 1,
                    name: '轮播图',
                    num: 0,
                    parentId: 32,
                    status: 0,
                    url: 'banner'
                  }
                ],
                code: 'banner:layout',
                component: 'Layout',
                icon: 'menu',
                menuCode: 'menu-b6bc695994b645fea8ef0cfa86d9a31d',
                menuId: 32,
                menuType: 0,
                name: '轮播图菜单',
                num: 2,
                status: 0,
                url: '/banner'
              },
              {
                childMenu: [
                  {
                    childMenu: [],
                    code: 'popularCourses',
                    component: 'popularCourses',
                    icon: 'job',
                    menuCode: 'menu-59e41ddde8d1466d833ff24562db4726',
                    menuId: 33,
                    menuType: 1,
                    name: '热门课程',
                    num: 0,
                    parentId: 32,
                    status: 0,
                    url: 'popular-courses'
                  }
                ],
                code: 'popularCourses:layout',
                component: 'Layout',
                icon: 'job',
                menuCode: 'menu-b6bc695994b645fea8ef0cfa86d9a31d',
                menuId: 32,
                menuType: 0,
                name: '热门课程菜单',
                num: 2,
                status: 0,
                url: '/popular-courses'
              },
              {
                childMenu: [
                  {
                    childMenu: [],
                    code: 'newActivity',
                    component: 'newActivity',
                    icon: 'oauth',
                    menuCode: 'menu-59e41ddde8d1466d833ff24562db4726',
                    menuId: 33,
                    menuType: 1,
                    name: '最新活动',
                    num: 0,
                    parentId: 32,
                    status: 0,
                    url: 'newActivity'
                  },
                  {
                    childMenu: [],
                    code: 'addActivity',
                    component: 'newActivity/add',
                    icon: 'oauth',
                    menuCode: 'menu-59e41ddde8d1466d833ff24562db47261',
                    menuId: 36,
                    menuType: 1,
                    name: '添加活动',
                    num: 0,
                    parentId: 32,
                    status: 1,
                    url: 'add'
                  }
                ],
                code: 'newActivity:layout',
                component: 'Layout',
                icon: 'oauth',
                menuCode: 'menu-b6bc695994b645fea8ef0cfa86d9a31d',
                menuId: 32,
                menuType: 0,
                name: '最新活动菜单',
                num: 2,
                status: 0,
                url: '/newActivity'
              },
              {
                childMenu: [
                  {
                    childMenu: [],
                    code: 'shopIntroduction',
                    component: 'shopIntroduction',
                    icon: 'resource',
                    menuCode: 'menu-59e41ddde8d1466d833ff24562db4726',
                    menuId: 33,
                    menuType: 1,
                    name: '本店介绍',
                    num: 0,
                    parentId: 32,
                    status: 0,
                    url: 'shopIntroduction'
                  }
                ],
                code: 'shopIntroduction:layout',
                component: 'Layout',
                icon: 'resource',
                menuCode: 'menu-b6bc695994b645fea8ef0cfa86d9a31d',
                menuId: 32,
                menuType: 0,
                name: '本店介绍菜单',
                num: 2,
                status: 0,
                url: '/shopIntroduction'
              },
              {
                childMenu: [
                  {
                    childMenu: [],
                    code: 'studentElegantDemeanor',
                    component: 'studentElegantDemeanor',
                    icon: 'tag',
                    menuCode: 'menu-59e41ddde8d1466d833ff24562db4726',
                    menuId: 33,
                    menuType: 1,
                    name: '学员风采',
                    num: 0,
                    parentId: 32,
                    status: 0,
                    url: 'student-elegant-demeanor'
                  }
                ],
                code: 'studentElegantDemeanor:layout',
                component: 'Layout',
                icon: 'tag',
                menuCode: 'menu-b6bc695994b645fea8ef0cfa86d9a31d',
                menuId: 32,
                menuType: 0,
                name: '学员风采菜单',
                num: 2,
                status: 0,
                url: '/student-elegant-demeanor'
              },
              {
                childMenu: [
                  {
                    childMenu: [],
                    code: 'bestSellingGoods',
                    component: 'bestSellingGoods',
                    icon: 'tab',
                    menuCode: 'menu-59e41ddde8d1466d833ff24562db4726',
                    menuId: 33,
                    menuType: 1,
                    name: '热销产品',
                    num: 0,
                    parentId: 32,
                    status: 0,
                    url: 'best-selling-goods'
                  }
                ],
                code: 'bestSellingGoods:layout',
                component: 'Layout',
                icon: 'tab',
                menuCode: 'menu-b6bc695994b645fea8ef0cfa86d9a31d',
                menuId: 32,
                menuType: 0,
                name: '热销产品菜单',
                num: 2,
                status: 0,
                url: '/best-selling-goods'
              },
              {
                code: 'img:data',
                component: 'Layout',
                icon: 'system',
                menuCode: 'menu-260d7044ff874eb3b6115522cfe6aade',
                menuId: 28,
                menuType: 0,
                name: '用户管理',
                num: 1,
                status: 0,
                url: '/system',
                childMenu: [
                  {
                    childMenu: [],
                    code: 'user',
                    component: 'system/user',
                    icon: 'system',
                    menuCode: 'menu-59e41ddde8d1466d833ff24562db4726',
                    menuId: 34,
                    menuType: 1,
                    name: '用户管理',
                    num: 0,
                    parentId: 28,
                    status: 0,
                    url: 'user'
                  }
                ]
              }
            ],
            message: '操作成功'
          }
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
