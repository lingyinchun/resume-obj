import Cookies from 'js-cookie'

const TokenKey = 'Staples-Token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token, expiresIn) {
  // return Cookies.set(TokenKey, token, { expires: new Date(expiresIn * 1000) })
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
