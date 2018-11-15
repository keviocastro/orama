import feed from './fbapi'

export const FEED_REQUEST = 'FEED_REQUEST'
export const request = partner => ({
  type: FEED_REQUEST,
  partner,
})
export const FEED_RECEIVED = 'FEED_RECEIVED'
export const received = (feed, partner) => ({
  type: FEED_RECEIVED,
  feed,
  partner,
})
export const FEED_REQUEST_ERROR = 'FEED_REQUEST_ERROR'
export const requestError = error => ({
  type: FEED_REQUEST_ERROR,
  error,
})
export const getFbFeed = partner => dispatch =>
  feed(fbId, dispatch, received, request, requestError, {
    partner
  })

export const SELECT_FOR_FEED = 'SELECT_FOR_FEED'
export const selectForFeed = (partner) => ({
  type: SELECT_FOR_FEED,
  partner
})