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
  action.notifications.forEach(newNotification => {
    let exist = false
    notifications.every(currentNotify => {
      if (currentNotify.id === newNotification.id) {
        exist = true
        return false
      } else {
        return true
      }
    })
    if (!exist) {
      notifications.unshift(newNotification)
    }
  })
  return notifications
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