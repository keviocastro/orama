import { SEGMENTS_RECEIVED, SEGMENTS_REQUEST, SEGMENTS_REQUEST_ERROR } from './../actions/segments';

const initialState = {
  data: [],
  isFetching: false,
  requestError: '',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SEGMENTS_RECEIVED:
      return {
        ...state,
        data: Array.isArray(action.segments) ? action.segments : [],
        isFetching: false,
      };
    case SEGMENTS_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case SEGMENTS_REQUEST_ERROR:
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
