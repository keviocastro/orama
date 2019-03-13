import React, { Component } from 'react'
import { AppState, Platform } from 'react-native'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import { StyleProvider } from 'native-base'
import thunkMiddleware from 'redux-thunk'
import logger from 'redux-logger'
import AppWithNavigationState from './components/Navigator'
import reducers from './reducers'
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import getTheme from './theme/components'
import material from './theme/variables/material'
import PushNotification from 'react-native-push-notification' // @todo migrate to react-native-firebase
import { SENDER_ID, LOG_REDUX } from './config'

const middleware = [thunkMiddleware]
if (process.env.NODE_ENV === 'development' && __DEV__ && LOG_REDUX) {
  middleware.push(logger)
}

const persistConfig = {
  key: 'root',
  storage,
}
const persistedReducer = persistReducer(persistConfig, reducers)

const store = createStore(persistedReducer, applyMiddleware(...middleware))
export default class App extends Component {

  componentDidMount() {
    PushNotification.configure({
      onNotification: function (notification) {
        if (__DEV__)
          console.log('NOTIFICATION:', notification)

      },
      onRegister: function (token) {
        if (__DEV__)
          console.log('TOKEN:', token)

      },
      senderID: SENDER_ID
    })
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