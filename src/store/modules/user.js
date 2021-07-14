import { loginByUsername, getUserInfo, refreshToken } from '@/api/login'
import { getToken, setToken, removeToken, removeUserNo, setTokenExpired, removeTokenExpired } from '@/utils/auth'

const user = {
  state: {
    code: '',
    token: getToken(),
    component: '',
    icon: '',
    level: '',
    menuCode: '',
    menuId: '',
    menuType: 1,
    name: '',
    avatar: '',
    parentName: '',
    url: '',
    roles: []
  },

  mutations: {
    SET_CODE: (state, code) => {
      state.code = code
    },
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_COMPONENT: (state, component) => {
      state.component = component
    },
    SET_ICON: (state, icon) => {
      state.icon = icon
    },
    SET_level: (state, level) => {
      state.level = level
    },
    SET_MENUCODE: (state, menuCode) => {
      state.menuCode = menuCode
    },
    SET_MENUID: (state, menuId) => {
      state.menuId = menuId
    },
    SET_MENUTYPE: (state, menuType) => {
      state.menuType = menuType
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_PARENTID: (state, parentId) => {
      state.parentId = parentId
    },
    SET_PARENTNAME: (state, parentName) => {
      state.parentName = parentName
    },
    SET_URL: (state, url) => {
      state.url = url
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_UUID: (state, roles) => {
      state.uuid = roles
    }
  },

  actions: {
    // user login
    // loginByUsername
    loginByUsername({ commit }, userInfo) {
      return new Promise((resolve, reject) => {
        loginByUsername(userInfo.email, userInfo.pwd).then(res => {
          const data = res.data
          if (data.data) {
            commit('SET_TOKEN', data.data.token.token)
            // 名称
            // commit('SET_NAME', data.data.userVO.username)
            // 头像
            // commit('SET_AVATAR', data.data.user.avatar)
            // 权限
            commit('SET_ROUTES', data.data.menuVOs)
            localStorage.setItem('youSongUserId', data.data.userVO.id)
            localStorage.setItem('nickName', data.data.userVO.nickName)
            localStorage.setItem('avatar', data.data.userVO.avatar)
            localStorage.setItem('roleCode', data.data.roleVOs.code)
            localStorage.setItem('roleId', data.data.roleVOs.id)
            // setUserNo(data.data.userVO.userId)
            setToken(data.data.token.token)

            setTokenExpired(data.data.token.token)
            resolve()
          } else {
            reject('用户名不存在或密码不正确')
          }
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 获取用户信息
    GetUserInfo({ commit }) {
      return new Promise((resolve, reject) => {
        getUserInfo().then(response => {
          // 由于mockjs 不支持自定义状态码只能这样hack
          // if (!response.data) {
          //   reject('Verification failed, please login again.')
          // }
          const data = response.data.data
          if (data && data.length > 0) { // 验证返回的roles是否是一个非空数组
            // 角色
            commit('SET_ROLES', data)
          } else {
            reject('getInfo: roles must be a non-null array!')
          }
          // 名称
          // commit('SET_NAME', data.name)
          // 头像
          // commit('SET_AVATAR', data.avatar)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 刷新token
    refreshToken({ commit }, userNo) {
      return new Promise((resolve, reject) => {
        refreshToken(userNo).then(response => {
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
    // 登出
    Logout({ commit }) {
      return new Promise((resolve) => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeTokenExpired()
        removeToken()
        removeUserNo()
        resolve()
      })
    }
    // getRegistered({ commit }) {
    //   return new Promise((resolve) => {
    //     commit('SET_TOKEN', '')
    //     commit('SET_ROLES', [])
    //     removeTokenExpired()
    //     removeToken()
    //     removeUserNo()
    //     resolve()
    //   })
    // },
  }
}

export default user

