import {
  NOTIFICATION_SEND,
  NOTIFICATION_RECEIVED,
  NOTIFICATION_LOGADING
} from './../actions/notifications'

const initialState = {
  notificationSend: null,
  notifications: [],
  loading: false
}

const mergeNotifications = (state, action) => {
  let notifications = state.notifications
  return Array.apply(notifications, action.notifications)
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case NOTIFICATION_SEND:
      return {
        ...state,
        notificationSend: action.notification
      }
    case NOTIFICATION_RECEIVED:
      return {
        ...state,
        notifications: mergeNotifications(state, action)
      }
    case NOTIFICATION_LOGADING:
      return {
        ...state,
        loading: action.loading
      }
    default:
      return state
  }
}

export default reducer