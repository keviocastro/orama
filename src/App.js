import React, { Component } from 'react'
import { AsyncStorage } from 'react-native';
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { StyleProvider } from 'native-base'
import thunkMiddleware from 'redux-thunk'
import logger from 'redux-logger'
import AppWithNavigationState from './components/Navigator'
import reducers from './reducers'
import getTheme from './theme/components'
import material from './theme/variables/material'
import { SENDER_ID, LOG_REDUX } from './config'
import { selectForChat } from './actions/partners'
import { getSegments } from './actions/segments'
import { getHighlights } from './actions/highlights'
import firebase from 'react-native-firebase'
const firestore = firebase.firestore()

const middleware = [thunkMiddleware]
if (process.env.NODE_ENV === 'development' && __DEV__ && LOG_REDUX) {
  middleware.push(logger)
}

const store = createStore(reducers, applyMiddleware(...middleware))
export default class App extends Component {

  componentDidMount() {
    const channel = new firebase.notifications.Android.Channel('orama', 'Orama Channel', firebase.notifications.Android.Importance.Max)
      .setDescription('Default app channel');

    firebase.notifications().android.createChannel(channel);

    firebase.messaging().getToken()
      .then(fcmToken => {
        if (fcmToken) {

          AsyncStorage.getItem('partner').then(partner => {
            if (partner) {
              partner = JSON.parse(partner)
              firestore.collection('partners').doc(partner.id)
                .update({
                  cloud_message_token: fcmToken
                })
              AsyncStorage.setItem('partner', JSON.stringify(partner))
            }
          })

          AsyncStorage.getItem('user').then(user => {
            if (user) {
              user = JSON.parse(user)
              firestore.collection('users').doc(user.id)
                .update({
                  cloud_message_token: fcmToken
                })
              AsyncStorage.setItem('user', JSON.stringify(user))
            }
          })

          console.info('token', fcmToken)
        } else {
          console.info('not token')
        }
      });

    this.app.store.dispatch(getSegments())
    this.app.store.dispatch(getHighlights())
  }

  handleAppStateChange(appState) {
    if (appState === 'background') {

    }
  }

  render() {
    return (
      <Provider store={store}>
        <StyleProvider style={getTheme(material)}>
          <AppWithNavigationState ref={app => { this.app = app }} />
        </StyleProvider>
      </Provider>
    )
  }
}