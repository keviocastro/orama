import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { StyleProvider } from 'native-base';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';
import AppWithNavigationState from './components/Navigator';
import reducers from './reducers';
import getTheme from './theme/components';
import material from './theme/variables/material';

const middleware = [thunkMiddleware];
if (process.env.NODE_ENV === 'development') {
  middleware.push(logger);
}

const store = createStore(reducers, applyMiddleware(...middleware));
const App = () => (
  <Provider store={store}>
    <StyleProvider style={getTheme(material)}>
      <AppWithNavigationState />
    </StyleProvider>
  </Provider>
);

export default App;
