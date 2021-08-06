
const storage = 'sessionStorage'
const tokenTableName = 'sessionToken'
/**
 * @description 获取sessionId
 * @returns {string|ActiveX.IXMLDOMNode|Promise<any>|any|IDBRequest<any>|MediaKeyStatus|FormDataEntryValue|Function|Promise<Credential | null>}
 */
export function getSessionId() {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.getItem(tokenTableName)
    } else if ('sessionStorage' === storage) {
      return sessionStorage.getItem(tokenTableName)
    } else {
      return localStorage.getItem(tokenTableName)
    }
  } else {
    return localStorage.getItem(tokenTableName)
  }
}

/**
 * @description 存储sessionId
 * @param sessionId
 * @returns {void|*}
 */
export function setSessionId(sessionId) {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.setItem(tokenTableName, sessionId)
    } else if ('sessionStorage' === storage) {
      return sessionStorage.setItem(tokenTableName, sessionId)
    } else {
      return localStorage.setItem(tokenTableName, sessionId)
    }
  } else {
    return localStorage.setItem(tokenTableName, sessionId)
  }
}

/**
 * @description 移除sessionId
 * @returns {void|Promise<void>}
 */
export function removeSessionId() {
  if (storage) {
    if ('localStorage' === storage) {
      return localStorage.removeItem(tokenTableName)
    } else if ('sessionStorage' === storage) {
      return sessionStorage.clear()
    } else {
      return localStorage.removeItem(tokenTableName)
    }
  } else {
    return localStorage.removeItem(tokenTableName)
  }
}
