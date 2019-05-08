import { add, get } from './api'

export const NOTIFICATION_SEND = 'NOTIFICATION_SEND'
export const notificationSend = (notification) => ({
  type: NOTIFICATION_SEND,
  notification
})

export const NOTIFICATION_LOGADING = 'NOTIFICATION_LOGADING'
export const loading = (loading) => ({
  type: NOTIFICATION_LOGADING,
  loading
})

export const NOTIFICATION_RECEIVED = 'NOTIFICATION_RECEIVED'
export const received = (notifications, filter) => ({
  type: NOTIFICATION_RECEIVED,
  notifications,
  partner_id: filter.value
})

export const sendNotification = (notification) => dispatch =>
  add('notifications', notification, dispatch, notificationSend)

export const getNotificationsRealtime = (partner) => dispatch =>
  // FIXME: Criar indice para sort no firebase
  get('notifications', { 'partner_id': partner.id }, {}, dispatch, true, loading, received)
