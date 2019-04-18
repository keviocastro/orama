import {
  POST_CREATED,
  ERROR_POST_CREATE,
  SENDING,
  CLEAR_FORM,
  RECEIVED,
  POSTS_LOADING,
  SELECT_IMAGE,
  CLEAR_POSTS,
  SELECTED_PARTNER_FOR_FEED
} from './../actions/posts'

const initialState = {
  posts: [],
  postsByPartner: {},
  postCreated: false,
  sending: false,
  text: '',
  image: null,
  partnerId: null,
  clearForm: false,
  loading: true,
  partnerSelectedForFeed: {}
}

const setPostsByPartner = (state, action) => {
  const postsByPartner = { ...state.posts }
  postsByPartner[action.filter.partner_id] = action.posts
  return postsByPartner
}


export default (state = initialState, action) => {
  switch (action.type) {
    case SELECT_IMAGE:
      return {
        ...state,
        image: action.image
      }
    case RECEIVED:
      return {
        ...state,
        posts: action.posts,
        postsByPartner: setPostsByPartner(state, action)
      }
    case CLEAR_POSTS:
      return {
        ...state,
        posts: []
      }
    case POSTS_LOADING:
      return {
        ...state,
        loading: action.loading
      }
    case POST_CREATED:
      return {
        ...state,
        posts: [action.post, ...state.posts],
        postCreated: true,
        clearForm: false
      }
    case ERROR_POST_CREATE:
      return {
        ...state,
        sendError: action.error,
        clearForm: false
      }
    case SENDING:
      return {
        ...state,
        sending: action.sending,
        clearForm: false
      }
    case CLEAR_FORM:
      return {
        ...state,
        sending: false,
        text: '',
        image: null,
        postCreated: false,
        clearForm: true
      }
    case SELECTED_PARTNER_FOR_FEED:
      return {
        ...state,
        partnerSelectedForFeed: action.partner
      }
    default:
      return state
  }
}
