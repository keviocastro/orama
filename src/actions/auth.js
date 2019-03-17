import { partnerLogin as apiPartnerLogin } from './api'

export const partnerLogin = (pass) => dispatch => {
  return apiPartnerLogin(pass, dispatch, loading)
}

const PARTNER_LOGOFF = 'PARTNER_LOGOFF'
export const partnerLogoff = () => ({
  type: PARTNER_LOGOFF
})

export const LOADING = 'LOADING'
export const loading = (loading) => ({
  type: LOADING,
  loading
})

export const INVALID_PASS = 'INVALID_PASS'
export const invalidPass = (invalid) => ({
  type: INVALID_PASS,
  invalid
})

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

