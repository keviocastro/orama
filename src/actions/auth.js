import { partnerLogin as apiPartnerLogin, userLogin as apiUserLogin, getOne } from './api'

export const partnerLogin = (pass) => dispatch => {
  return apiPartnerLogin(pass, dispatch, partnerLoginLoading, redirectToAccount, invalidPass)
}

export const userLogin = (phone) => dispatch => {
  return apiUserLogin(phone, dispatch, userLoginLoading, loginUser, redirectToChat)
}

export const LOGIN_USER = 'LOGIN_USER'
export const loginUser = (user) => ({
  type: LOGIN_USER,
  user
})

const USER_LOGOFF = 'USER_LOGOFF'
export const userLogoff = () => ({
  type: USER_LOGOFF
})


export const INVALID_PHONE = 'INVALID_PHONE'
export const invalidPhone = (invalid) => ({
  type: INVALID_PHONE,
  invalid
})

export const REDIRECT_TO_ACCOUNT = 'REDIRECT_TO_ACCOUNT'
export const redirectToAccount = (redirect) => ({
  type: REDIRECT_TO_ACCOUNT,
  redirect
})

export const REDIRECT_TO_CHAT = 'REDIRECT_TO_CHAT'
export const redirectToChat = (redirect) => ({
  type: REDIRECT_TO_CHAT,
  redirect
})

export const PARTNER_LOGOFF = 'PARTNER_LOGOFF'
export const partnerLogoff = () => ({
  type: PARTNER_LOGOFF
})

export const USER_LOGIN_LOADING = 'USER_LOGIN_LOADING'
export const userLoginLoading = (loading) => ({
  type: USER_LOGIN_LOADING,
  loading
})

export const PARTNER_LOGIN_LOADING = 'PARTNER_LOGIN_LOADING'
export const partnerLoginLoading = (loading) => ({
  type: PARTNER_LOGIN_LOADING,
  loading
})

export const INVALID_PASS = 'INVALID_PASS'
export const invalidPass = (invalid) => ({
  type: INVALID_PASS,
  invalid
})

export const LOAD_DATA_LOGGED_PARTNER = 'LOAD_DATA_LOGGED_PARTNER'
export const receivedLoadDataLoggedPartner = (partner) => ({
  type: LOAD_DATA_LOGGED_PARTNER,
  partner
})

export const loadDataLoggedPartner = (partnerId) => dispatch =>
  getOne('partners', partnerId, dispatch, receivedLoadDataLoggedPartner)

export const ADD_LOGGED_USER = 'ADD_LOGGED_USER'
export const addLoggedUser = (fbId, fbAcessToken, partner) => ({
  type: ADD_LOGGED_USER,
  fbId,
  fbAcessToken,
  partner
})

export const REMOVE_LOGGED_USER = 'REMOVE_LOGGED_USER'
export const removeLoggedUser = () => ({
  type: REMOVE_LOGGED_USER
})

