import {
  ADD_LOGGED_USER,
  REMOVE_LOGGED_USER,
  INVALID_PASS,
  LOADING,
  PARTNER_LOGOFF,
  REDIRECT_TO_ACCOUNT,
  LOGIN_USER,
  INVALID_PHONE,
  USER_LOGOFF
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
  loading: false,
  redirectToAccount: false,
  invalidPhone: false,
  user: null,
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      AsyncStorage.setItem('user', JSON.stringify(action.user))
      return {
        ...state,
        user: action.user,
        loading: false
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
        partner: action.partner,
        loading: false
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
    case LOADING:
      return {
        ...state,
        loading: action.loading
      }
    case REDIRECT_TO_ACCOUNT:
      return {
        ...state,
        redirectToAccount: action.redirect
      }
    default:
      return state
  }
}

export default reducer