import _ from 'lodash'

const TOKEN_KEY = 'access_token'
const TOKEN_EXPIRED_DATE_KEY = 'token_expired_date'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_KEY = 'user'
const LANG_KEY = 'lang'
const PERMISSION_KEY = 'permissions'

const TokenService = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY)
  },

  setToken(accessToken) {
    localStorage.setItem(TOKEN_KEY, accessToken, { expires: 60 })
  },

  removeToken() {
    localStorage.removeItem(TOKEN_KEY)
  },

  getLang() {
    return localStorage.getItem(LANG_KEY)
  },

  setLang(lang) {
    localStorage.setItem(LANG_KEY, lang)
  },

  setPermissions(permissions) {
    localStorage.setItem(PERMISSION_KEY, JSON.stringify(permissions))
  },

  getPermissions() {
    if (localStorage.getItem(PERMISSION_KEY)) return JSON.parse(localStorage.getItem(PERMISSION_KEY))
    return [];
  },

  removePermissions() {
    localStorage.removeItem(PERMISSION_KEY)
  },

  getUser() {
    if (localStorage.getItem(USER_KEY)) return JSON.parse(localStorage.getItem(USER_KEY))
    return {}
  },

  getId() {
    const user = this.getUser()
    return `${_.get(user, 'id')}`
  },

  getFullName() {
    const user = this.getUser()
    return `${_.get(user, 'lastName')} ${_.get(user, 'firstName')}`
  },

  getPosition() {
    const user = this.getUser()
    return _.get(user, 'position', '');
  },

  getAvatarPath() {
    const user = this.getUser()
    return _.get(user, 'avatar.filePath', null)
  },

  setUser(user) {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  },

  removeUser() {
    localStorage.removeItem(USER_KEY)
  },

  getTokenExpiredDate() {
    return localStorage.getItem(TOKEN_EXPIRED_DATE_KEY)
  },

  setTokenExpiredDate(expiredDate) {
    localStorage.setItem(TOKEN_EXPIRED_DATE_KEY, expiredDate)
  },

  removeTokenExpiredDate() {
    localStorage.removeItem(TOKEN_EXPIRED_DATE_KEY)
  },

  getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },

  setRefreshToken(refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken, { expires: 30 })
  },

  removeRefreshToken() {
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },

  getHeader() {
    return {
      Authorization: `Bearer ${this.getToken()}`,
      'Accept-Language': this.getLang() || 'ja',
    }
  },

  getHeaderUpload() {
    return {
      Authorization: `Bearer ${this.getToken()}`,
      'Accept-Language': this.getLang() || 'ja',
      'Content-Type': 'multipart/form-data',
    }
  },
}

export default TokenService
