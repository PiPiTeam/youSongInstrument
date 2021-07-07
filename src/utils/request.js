import axios from 'axios'
import { Notification, MessageBox } from 'element-ui'
import store from '@/store'
import router from '@/router'
import { getToken, setToken, getTokenExpired, setTokenExpired } from '@/utils/auth'
import { refreshToken } from '@/api/login'

axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url 'http://192.168.0.156:8087' process.env.VUE_APP_BASE_API
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 0 // request timeout
})

function isTokenExpired(token) {
  const expires_time = getTokenExpired()
  const curentTime = new Date().getTime()
  if (curentTime >= expires_time) {
    return true
  } else {
    return false
  }
}

// request拦截器
let isRefreshing = false
let requests = []
service.interceptors.request.use(
  config => {
    const TokenExpired = getTokenExpired()
    if (getToken()) {
      config.headers['Authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    if (config.url.indexOf('refreshToken') >= 0 || config.url.indexOf('login') >= 0) {
      return config
    }
    if (config.method === 'post' || config.method === 'put') { // ['Content-Type']
      config.headers['content-type'] = 'application/x-www-form-unlencoded'
    }
    if (config.isExport) {
      config.headers['content-type'] = 'application/x-www-form-urlencoded'
    }
    if (TokenExpired && isTokenExpired(TokenExpired)) {
      if (!isRefreshing) {
        isRefreshing = true
        refreshToken().then(res => {
          const { token, expired } = res.data.data
          setTokenExpired(expired)
          setToken(token)
          isRefreshing = false
          return token
        }).then((token) => {
          requests.forEach(cb => cb(token))
          // 执行完成后，清空队列
          requests = []
        }).catch(res => {
          console.error('refresh token error: ', res)
        })
      }
      const retryOriginalRequest = new Promise((resolve) => {
        requests.push((token) => {
          // 因为config中的token是旧的，所以刷新token后要将新token传进来
          config.headers['Authorization'] = token
          resolve(config)
        })
      })
      return retryOriginalRequest
    }
    return config
  },
  error => {
    Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(

  response => {
    const code = response.data.code
    if (code === '20021') {
      MessageBox.alert(
        '登录状态已过期，请重新登录',
        '系统提示',
        {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        store.dispatch('Logout').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      })
    } else if (code === '20000' || code === '20001') {
      Notification.error({
        title: response.data.message,
        duration: 2500
      })
      return Promise.reject('error')
    } else if (code === '3000') {
      Notification.warning({
        title: response.data.message,
        duration: 2500
      })
    } else {
      return response
    }
  },
  error => {
    let code = 0
    try {
      code = error.response.status
    } catch (e) {
      if (error.toString().indexOf('Error: timeout') !== -1) {
        Notification.error({
          title: '网络请求超时',
          duration: 2500
        })
        return Promise.reject(error)
      }
      if (error.toString().indexOf('Error: Network Error') !== -1) {
        Notification.error({
          title: '网络请求错误',
          duration: 2500
        })
        return Promise.reject(error)
      }
    }
    if (code === 504 || code === 500) {
      Notification.error({
        title: '服务器异常',
        duration: 2500
      })
      return Promise.reject(error)
    }
    if (code === 401) {
      MessageBox.confirm(
        '登录状态已过期，您可以继续留在该页面，或者重新登录',
        '系统提示',
        {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }
      ).then(() => {
        store.dispatch('Logout').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      })
    } else if (code === 403) {
      router.push({ path: '/401' })
    } else {
      console.error(error)
      const errorMsg = error.response.data.message
      if (errorMsg !== undefined) {
        Notification.error({
          title: errorMsg,
          duration: 1000
        })
      }
    }
    return Promise.reject(error)
  }
)

export default service
