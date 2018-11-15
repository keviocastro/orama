import {
  FEED_REQUEST,
  FEED_RECEIVED,
  FEED_REQUEST_ERROR,
  SELECT_FOR_FEED
} from './../actions/feed'

const initialState = {
  feed: {},
  selectedForChat: {},
  isFetching: false,
  requestError: ''
}

const getFeedByPartner = (state, action) => {
  const feed = { ...state.feed }
  feed[action.partner.id] = action.feed
  return feed
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case FEED_REQUEST:
      return {
        ...state,
        isFetching: true,
        requestError: ''
      }
    case FEED_RECEIVED:
      return {
        ...state,
        feed: getFeedByPartner(state, action),
      }
    case FEED_REQUEST_ERROR:
      return {
        ...state,
        requestError: action.error,
      }
    case SELECT_FOR_FEED:
      return {
        ...state,
        selectedForFeed: action.partner,
      }
    default:
      return state
  }
}

export default reducer
