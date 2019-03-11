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