import { combineReducers } from 'redux';

import segments from './segments';
import partners from './partners';
import nav from './nav';
import chat from './chat';

export default combineReducers({
  segments,
  partners,
  nav,
  chat,
});
