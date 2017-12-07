import { PARTNERS_RECEIVED, PARTNERS_REQUEST, PARTNERS_REQUEST_ERROR } from './../actions/partners';

const initialState = {
  bySegment: {}, // {segmentId<id>: {data: array, isFetching: bool, requestError: string}}
  isFetching: true,
  requestError: '',
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
