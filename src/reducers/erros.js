import { FIREBASE_ERROR } from './../actions/erros'

const initialState = {
  firebaseError: null,
}

export default (state = initialState, action) => {
  switch (action.type) {

    case FIREBASE_ERROR:
      return { ...state, firebaseError: action.error }

    default:
      return state
  }
}
