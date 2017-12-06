import { combineReducers } from 'redux';

import segments from './segments';
import partners from './partners';

export default combineReducers({
  segments,
  partners,
});
