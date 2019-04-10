import {
  PARTNERS_RECEIVED,
  PARTNERS_REQUEST,
  PARTNERS_REQUEST_ERROR,
  PARTNERS_SELECT,
  SELECTED_FOR_CHAT,
  LOGIN,
  REMOVE_CHAT_IMAGE,
  RECEIVE_SEARCH_PARTNERS,
  PARTNERS_SEARCH_LOADING
} from './../actions/partners'

const initialState = {
  bySegment: {
    isFetching: true,
    requestError: '',
    data: [],
  },
  searchPartners: [],
  search: '',
  searchLoading: false,
  imagesChatByPartner: {},
  currentSegmentId: null,
  partnerSelectedForChat: {},
  images: [],
  chatType: null,
  logged_in_is_partner: false,
  logged_in_partner: {}
}

const setPartnersBySegment = (state, action) => {
  const bySegment = { ...state.bySegment }

  action.partners = action.partners.filter((partner) => {
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
      let imageExists = false
      imagesChatByPartner[action.partner.id].forEach(image => {
        if (image === action.image)
          imageExists = true
      })
      if (!imageExists) {
        imagesChatByPartner[action.partner.id] = [...imagesChatByPartner[action.partner.id], action.image]
      }
    } else {
      imagesChatByPartner[action.partner.id] = [action.image]
    }
  }

  return imagesChatByPartner
}

const removeChatImageByPartner = (state, action) => {
  state.imagesChatByPartner[action.partnerId] = state.imagesChatByPartner[action.partnerId].filter(image => {
    if (image !== action.image) {
      return true
    } else {
      return false
    }
  })

  return state.imagesChatByPartner;
}

const removeAccents = (text) => {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, "")
}

// FIXME: Remover esse filtro quando criar o fullsearchtext no firestore
const filterPartnerByName = (partners, name) => {
  let searchNormalized = removeAccents(name).toLowerCase()
  return partners.filter(partner => {
    let nameNormalized = removeAccents(partner.name).toLowerCase()
    if (nameNormalized.search(searchNormalized) === -1) {
      return false
    } else {
      return true
    }
  })
}

const reducer = (state = initialState, action) => {

  switch (action.type) {
    case RECEIVE_SEARCH_PARTNERS:
      return {
        ...state,
        searchPartners: filterPartnerByName(action.partners, action.search),
        search: action.search
      }
    case PARTNERS_SEARCH_LOADING:
      return {
        ...state,
        searchLoading: action.loading
      }
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
    case REMOVE_CHAT_IMAGE:
      return {
        ...state,
        imagesChatByPartner: removeChatImageByPartner(state, action)
      }
    case LOGIN:
      return {
        ...state,
        logged_in_is_partner: true,
        logged_in_partner: action.partner
      }
    default:
      return state
  }
}

export default reducer
