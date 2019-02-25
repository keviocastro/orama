import { ORIENTATION_CHANGE } from './../actions/dimensions'

const initialState = {
  orientation: 'portrait'
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ORIENTATION_CHANGE:
      return {
        ...state,
        orientation: action
      }
    default:
      return state
  }
}

export default reducer