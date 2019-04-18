import React, { Component } from 'react'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { StyleProvider, AsyncStorage } from 'native-base'
import thunkMiddleware from 'redux-thunk'
import logger from 'redux-logger'
import AppWithNavigationState from './components/Navigator'
import reducers from './reducers'
import getTheme from './theme/components'
import material from './theme/variables/material'
import PushNotification from 'react-native-push-notification' // @todo migrate to react-native-firebase
import { SENDER_ID, LOG_REDUX } from './config'
import { selectedPartnerForFeed } from './actions/partners'
import firebase from 'react-native-firebase'
const firestore = firebase.firestore()

const middleware = [thunkMiddleware]
if (process.env.NODE_ENV === 'development' && __DEV__ && LOG_REDUX) {
  middleware.push(logger)
}

const store = createStore(reducers, applyMiddleware(...middleware))
export default class App extends Component {

  componentDidMount() {
    PushNotification.configure({
      onNotification: function (notification) {
        console.log('notification', notification)
        if (notification.partner_id) {
          firestore.collection('partners').doc(notification.partner_id)
            .get()
            .then(snapshot => {
              let partner = snapshot.data()
              AsyncStorage.setItem('partnerNotification', JSON.stringify(partner))
            })
        }
      },
      onRegister: function (token) {
        console.log('TOKEN:', token)

      },
      senderID: SENDER_ID
    })
    PushNotification.registerNotificationActions(['Eu quero']);
    PushNotification.subscribeToTopic('orama')
    // AppState.addEventListener('change', this.handleAppStateChange);
  }

  componentWillUnmount() {
    // AppState.removeEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange(appState) {
    if (appState === 'background') {

    }
  }

  render() {
    return (
      <Provider store={store}>
        <StyleProvider style={getTheme(material)}>
          <AppWithNavigationState />
        </StyleProvider>
      </Provider>
    )
  }
}