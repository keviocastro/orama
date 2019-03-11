import { SEGMENTS_RECEIVED, SEGMENTS_REQUEST, SEGMENTS_REQUEST_ERROR } from './../actions/segments';

const initialState = {
  data: [],
  isFetching: false,
  requestError: '',
};

const addFixedSegmentOrama = (segments, state) => {
  segments.unshift({
    id: 0,
    name: 'O-rama Fast Commerce',
    image: 'https://us-central1-o-rama2.cloudfunctions.net/api/images/segments/BotaoOrama.JPG'
  });
  segments.push({
    logoff: true,
    id: new Date().getTime()
  });
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SEGMENTS_RECEIVED:
      addFixedSegmentOrama(action.segments)
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
