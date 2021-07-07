import Cookies from 'js-cookie'
import { TokenKey, TokenExpired, UserNoKey } from '@/utils/cookie-key'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function getTokenExpired() {
  return Cookies.get(TokenExpired)
}

export function setTokenExpired(timestamp) {
  return Cookies.set(TokenExpired, timestamp)
}

export function removeTokenExpired() {
  return Cookies.remove(TokenExpired)
}

export function getUserNo() {
  return Cookies.get(UserNoKey)
}

export function setUserNo(UserNo) {
  return Cookies.set(UserNoKey, UserNo)
}

export function removeUserNo() {
  return Cookies.remove(UserNoKey)
}
