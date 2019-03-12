import { ADD_LOGGED_USER, REMOVE_LOGGED_USER, INVALID_PASS as INVALID_PASS } from "./../actions/auth"

const initialState = {
  fbId: null,
  fbAcessToken: null,
  partner: null,
  invalidPass: false
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_LOGGED_USER:
      return {
        ...state,
        fbId: action.fbId,
        fbAcessToken: action.fbAcessToken,
        partner: action.partner,
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
    default:
      return state
  }
}

export default reducer