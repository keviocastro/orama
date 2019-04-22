import firebase from 'react-native-firebase';
import { NotificationOpen } from 'react-native-firebase'

export default async (notificationOpen) => {
  console.log('notify.js', notificationOpen)

  let notification = new firebase.notifications.Notification();
  notification = notification.setTitle(notificationOpen.data.title).setBody(notificationOpen.data.body).setData(notificationOpen.data)

  notification.android.setPriority(firebase.notifications.Android.Priority.High)
  notification.android.setChannelId('orama')
  notification.android.setLargeIcon('ic_launcher')

  if (notificationOpen.data.image) {
    notification.android.setBigPicture(notificationOpen.data.image, 'ic_launcher', notificationOpen.data.title, notificationOpen.data.body)
  }

  firebase.notifications().displayNotification(notification)

  return Promise.resolve();
}