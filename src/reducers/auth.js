import {
  ADD_LOGGED_USER,
  REMOVE_LOGGED_USER,
  INVALID_PASS,
  LOADING,
  PARTNER_LOGOFF,
  REDIRECT_TO_ACCOUNT
} from "./../actions/auth"

const initialState = {
  fbId: null,
  fbAcessToken: null,
  partner: null,
  invalidPass: false,
  loading: false,
  redirectToAccount: false
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_LOGGED_USER:
      return {
        ...state,
        fbId: action.fbId,
        fbAcessToken: action.fbAcessToken,
        partner: action.partner,
        loading: false
      }
    case PARTNER_LOGOFF:
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