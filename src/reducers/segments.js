import { RECEIVE_SEGMENTS, REQUEST_SEGMENTS, REQUEST_ERROR } from './../actions/segments';

const initialState = {
  data: [],
  isFetching: false,
  requestError: '',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUEST_SEGMENTS:
      return {
        ...state,
        isFetching: true,
      };
    case RECEIVE_SEGMENTS:
      return {
        ...state,
        data: Array.isArray(action.segments) ? action.segments : [],
        isFetching: false,
      };
    case REQUEST_ERROR:
      return {
        ...state,
        isFetching: false,
        requestError: action.error,
      };
    default:
      return state;
  }
};

export default reducer;
