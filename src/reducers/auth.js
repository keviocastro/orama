import {
  ADD_LOGGED_USER,
  REMOVE_LOGGED_USER,
  INVALID_PASS,
  USER_LOGIN_LOADING,
  PARTNER_LOGIN_LOADING,
  PARTNER_LOGOFF,
  REDIRECT_TO_ACCOUNT,
  LOGIN_USER,
  INVALID_PHONE,
  USER_LOGOFF,
  LOAD_DATA_LOGGED_PARTNER,
  REDIRECT_TO_CHAT
} from "./../actions/auth"
import { AsyncStorage } from 'react-native'

AsyncStorage.getItem('user').then(user => {
  if (user) {
    initialState.user = JSON.parse(user)
  }
})

AsyncStorage.getItem('partner').then(partner => {
  if (partner) {
    initialState.partner = JSON.parse(partner)
  }
})


let initialState = {
  fbId: null,
  fbAcessToken: null,
  partner: null,
  invalidPass: false,
  userLoginloading: false,
  partnerLoginLoading: false,
  redirectToAccount: false,
  redirectToChat: false,
  invalidPhone: false,
  user: null,
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      AsyncStorage.setItem('user', JSON.stringify(action.user))
      return {
        ...state,
        user: action.user
      }
    case USER_LOGOFF:
      AsyncStorage.removeItem('user')
      return {
        ...state,
        user: null,
      }
    case INVALID_PHONE:
      return {
        ...state,
        invalidPhone: action.invalid
      }
    case ADD_LOGGED_USER: // FIXME:  Renomear para diferenciar login de parceiros e usuários
      AsyncStorage.setItem('partner', JSON.stringify(action.partner))
      return {
        ...state,
        fbId: action.fbId,
        fbAcessToken: action.fbAcessToken,
        partner: action.partner
      }
    case LOAD_DATA_LOGGED_PARTNER:
      return {
        ...state,
        partner: action.partner
      }
    case PARTNER_LOGOFF:
      AsyncStorage.removeItem('partner')
      return {
        ...state,
        fbId: null,
        fbAcessToken: null,
        partner: null,
      }
    case REMOVE_LOGGED_USER:
      return {
        ...state,
        fbId: null,
        fbAcessToken: null,
        partner: null,
      }
    case INVALID_PASS:
      return {
        ...state,
        invalidPass: action.invalid
      }
    case USER_LOGIN_LOADING:
      return {
        ...state,
        userLoginLoading: action.loading
      }
    case PARTNER_LOGIN_LOADING:
      return {
        ...state,
        partnerLoginLoading: action.loading
      }
    case REDIRECT_TO_ACCOUNT:
      // PARTNER
      return {
        ...state,
        redirectToAccount: action.redirect
      }
    case REDIRECT_TO_CHAT:
      // USER
      return {
        ...state,
        redirectToChat: action.redirect
      }
    default:
      return state
  }
}

export default reducer