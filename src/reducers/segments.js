import { SEGMENTS_RECEIVED, SEGMENTS_LOADING, SEGMENTS_REQUEST_ERROR } from './../actions/segments';

const initialState = {
  segments: [],
  loading: false
};

const addFixedSegmentOrama = (segments, state) => {
  segments.push({
    id: 0,
    name: 'O-rama Fast Commerce',
    image: 'https://i.ibb.co/F3zbXsk/segmento-orama.jpg'
  });
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SEGMENTS_RECEIVED:
      addFixedSegmentOrama(action.segments)
      return {
        ...state,
        segments: Array.isArray(action.segments) ? action.segments : [],
        loading: false,
      };
    case SEGMENTS_LOADING:
      return {
        ...state,
        loading: action.loading,
      };
    default:
      return state;
  }
};

export default reducer;
