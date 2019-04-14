import {
  NOTIFICATION_SEND,
} from './../actions/notifications'

const initialState = {
  notificationSend: null
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case NOTIFICATION_SEND:
      return {
        ...state,
        notificationSend: action.notification
      }
    default:
      return state
  }
}

export default reducer