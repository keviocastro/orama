import { PARTNERS_RECEIVED, PARTNERS_REQUEST, PARTNERS_REQUEST_ERROR } from './../actions/partners';

const initialState = {
  bySegment: {
    isFetching: true,
    requestError: '',
    data: [],
  },
  currentSegmentId: -1,
};

const setPartnersBySegment = (state, action) => {
  const bySegment = { ...state.bySegment };

  bySegment[action.segmentId] = {
    isFetching: false,
    requestError: '',
    data: action.partners,
  };

  return bySegment;
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case PARTNERS_RECEIVED:
      return {
        ...state,
        bySegment: setPartnersBySegment(state, action),
        currentSegmentId: action.segmentId,
      };
    case PARTNERS_REQUEST:
      return {
        ...state,
        currentSegmentId: action.segmentId,
      };
    case PARTNERS_REQUEST_ERROR:
      return {
        ...state,
        requestError: action.error,
      };
    default:
      return state;
  }
};

export default reducer;
