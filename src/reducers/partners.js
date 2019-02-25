import {
  PARTNERS_RECEIVED,
  PARTNERS_REQUEST,
  PARTNERS_REQUEST_ERROR,
  PARTNERS_SELECT,
  SELECTED_FOR_CHAT,
  LOGIN
} from './../actions/partners'

const initialState = {
  bySegment: {
    isFetching: true,
    requestError: '',
    data: [],
  },
  imagesChatByPartner: [],
  currentSegmentId: null,
  partnerSelectedForChat: {},
  images: [],
  chatType: null,
}

const setPartnersBySegment = (state, action) => {
  const bySegment = { ...state.bySegment }

  action.partners = action.partners.filter((partner) => {
    //@todo To correct an api error. Remove after upgrading an api
    if (partner.hasOwnProperty('segmentIds') &&
      partner.segmentIds.indexOf(action.segmentId) != -1) {
      return partner
    }
  })
  bySegment[action.segmentId] = {
    isFetching: false,
    requestError: '',
    data: action.partners,
  }

  return bySegment
}

const setChatImagesByPartner = (state, action) => {
  const imagesChatByPartner = { ...state.imagesChatByPartner }

  if (action.image != undefined) {
    if (imagesChatByPartner.hasOwnProperty(action.partner.id)) {
      imagesChatByPartner[action.partner.id] = [...imagesChatByPartner[action.partner.id], action.image]
    } else {
      imagesChatByPartner[action.partner.id] = [action.image]
    }
  }

  return imagesChatByPartner
}

const reducer = (state = initialState, action) => {

  switch (action.type) {
    case PARTNERS_RECEIVED:
      return {
        ...state,
        bySegment: setPartnersBySegment(state, action),
        currentSegmentId: action.segmentId,
      }
    case PARTNERS_REQUEST:
      return {
        ...state,
        currentSegmentId: action.segmentId,
      }
    case PARTNERS_REQUEST_ERROR:
      return {
        ...state,
        requestError: action.error,
      }
    case PARTNERS_SELECT:
      return {
        ...state,
        partnerSelected: action.partner,
      }
    case SELECTED_FOR_CHAT:
      return {
        ...state,
        partnerSelectedForChat: action.partner,
        imagesChatByPartner: setChatImagesByPartner(state, action)
      }
    case LOGIN:
      return {
        ...state,
        logged_in_is_partner: true
      }
    default:
      return state
  }
}

export default reducer
