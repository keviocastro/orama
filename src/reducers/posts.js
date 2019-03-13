import { POST_CREATED, ERROR_POST_CREATE, SENDING, CLEAR_FORM } from './../actions/posts'

const initialState = {
  posts: [],
  postCreated: false,
  sending: false,
  text: '',
  image: null,
  partnerId: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case POST_CREATED:
      return {
        ...state,
        postCreated: true,
        posts: [...state.posts, action.post]
      }
    case ERROR_POST_CREATE:
      return {
        ...state,
        sendError: action.error
      }
    case SENDING:
      return {
        ...state,
        sending: action.sending
      }
    case CLEAR_FORM:
      return {
        ...state,
        sending: false,
        text: '',
        image: null,
        postCreated: false
      }

    default:
      return state
  }
}
