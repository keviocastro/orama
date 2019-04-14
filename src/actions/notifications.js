import { add } from './api'

export const NOTIFICATION_SEND = 'NOTIFICATION_SEND'
export const notificationSend = (notification) => ({
  type: NOTIFICATION_SEND,
  notification
})

export const sendNotification = (notification) => dispatch =>
  add('notifications', notification, dispatch, notificationSend)
