import React, { Component } from 'react'
import { AppState, Platform } from 'react-native'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { StyleProvider } from 'native-base'
import thunkMiddleware from 'redux-thunk'
import logger from 'redux-logger'
import AppWithNavigationState from './components/Navigator'
import reducers from './reducers'
import getTheme from './theme/components'
import material from './theme/variables/material'
import PushNotification from 'react-native-push-notification'
import { DEBUG, SENDER_ID } from './config'

const middleware = [thunkMiddleware]
if (process.env.NODE_ENV === 'development' && DEBUG === true) {
  middleware.push(logger)
}

const store = createStore(reducers, applyMiddleware(...middleware))
export default class App extends Component {

  componentDidMount() {
    PushNotification.configure({
      onNotification: function (notification) {
        if (DEBUG)
          console.log('NOTIFICATION:', notification)

      },
      onRegister: function (token) {
        if (DEBUG)
          console.log('TOKEN:', token);

      },
      senderID: SENDER_ID
    })
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