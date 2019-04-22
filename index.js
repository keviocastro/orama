/** @format */

import { AppRegistry } from 'react-native'
import App from './src/App'
import { name as appName } from './app.json'
import { YellowBox } from 'react-native'
import Notify from './src/components/notify';

YellowBox.ignoreWarnings([
  'Require cycle:',
]);

AppRegistry.registerComponent(appName, () => App)
AppRegistry.registerHeadlessTask('RNFirebaseBackgroundMessage', () => Notify);
