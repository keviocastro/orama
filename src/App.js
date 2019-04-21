import React, { Component } from 'react'
import { Linking, AsyncStorage } from 'react-native';
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
import firebase from 'react-native-firebase'
const firestore = firebase.firestore()

const middleware = [thunkMiddleware]
if (process.env.NODE_ENV === 'development' && __DEV__ && LOG_REDUX) {
  middleware.push(logger)
}

const store = createStore(reducers, applyMiddleware(...middleware))
export default class App extends Component {

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