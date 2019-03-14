import {
  POST_CREATED,
  ERROR_POST_CREATE,
  SENDING,
  CLEAR_FORM,
  RECEIVED,
  LOADING,
  SELECT_IMAGE
} from './../actions/posts'

const initialState = {
  posts: [],
  postCreated: false,
  sending: false,
  text: '',
  image: null,
  partnerId: '4ehDYoJxRPuSRgiecN02', // @todo remover. Somente debug
  clearForm: false,
  loading: true
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
        posts: action.posts
      }
    case LOADING:
      return {
        ...state,
        loading: action.loading
      }
    case POST_CREATED:
      return {
        ...state,
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
    default:
      return state
  }
}
