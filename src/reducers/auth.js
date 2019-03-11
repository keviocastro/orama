import { ADD_LOGGED_USER, REMOVE_LOGGED_USER } from "./../actions/auth"

const initialState = {
  fbId: null,
  fbAcessToken: {},
  partner: {}
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
    default:
      return state
  }
}

export default reducer