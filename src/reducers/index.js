import { combineReducers } from 'redux'

import segments from './segments'
import partners from './partners'
import nav from './nav'
import chat from './chat'
import highlights from './highlights'
import dimensions from './dimensions'
import auth from './auth'
import posts from './posts'

export default combineReducers({
  segments,
  partners,
  nav,
  chat,
  highlights,
  dimensions,
  auth,
  posts
});
