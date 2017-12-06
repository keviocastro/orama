import { PARTNERS_RECEIVED, PARTNERS_REQUEST, PARTNERS_REQUEST_ERROR } from './../actions/partners';

const initialState = {
  data: [],
  isFetching: true,
  requestError: '',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case PARTNERS_RECEIVED:
      return {
        ...state,
        data: Array.isArray(action.partners) ? action.partners : [],
        isFetching: false,
      };
    case PARTNERS_REQUEST:
      return {
        ...state,
        isFetching: true,
      };
    case PARTNERS_REQUEST_ERROR:
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
