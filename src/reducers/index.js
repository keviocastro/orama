import { combineReducers } from 'redux';

import segments from './segments';
import partners from './partners';
import nav from './nav';

export default combineReducers({
  segments,
  partners,
  nav,
});
