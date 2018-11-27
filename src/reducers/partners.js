import {
  PARTNERS_RECEIVED,
  PARTNERS_REQUEST,
  PARTNERS_REQUEST_ERROR,
  PARTNERS_SELECT,
} from './../actions/partners';

const initialState = {
  bySegment: {
    isFetching: true,
    requestError: '',
    data: [],
  },
  currentSegmentId: null
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
    case PARTNERS_SELECT:
      return {
        ...state,
        partnerSelected: action.partner,
      };
    default:
      return state;
  }
};

export default reducer;
