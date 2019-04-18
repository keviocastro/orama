import { search, partnerUpdateFbAcessToken, checkIsPartner, get, searchPartnerByName, getOne } from './api'

export const PARTNERS_RECEIVED = 'PARTNERS_RECEIVED'
export const received = (partners, filter) => ({
  type: PARTNERS_RECEIVED,
  partners,
  segmentId: filter.value,
})
export const PARTNERS_REQUEST = 'PARTNERS_REQUEST'
export const request = filter => ({
  type: PARTNERS_REQUEST,
  segmentId: filter.value,
})
export const PARTNERS_REQUEST_ERROR = 'PARTNERS_REQUEST_ERROR'
export const requestError = error => ({
  type: PARTNERS_REQUEST_ERROR,
  error,
})
export const getPartners = segmentId => dispatch =>
  search('partners', dispatch, received, request, requestError, {
    field: 'segmentIds',
    value: segmentId,
  })

export const PARTNERS_SEARCH_LOADING = 'PARTNERS_SEARCH_LOADING'
export const partnersSearchLoading = loading => ({
  type: PARTNERS_SEARCH_LOADING,
  loading
})
export const RECEIVE_SEARCH_PARTNERS = 'RECEIVE_SEARCH_PARTNERS'
export const receiveSearchPartners = (partners, filter) => ({
  type: RECEIVE_SEARCH_PARTNERS,
  partners,
  search: filter.name,
})

export const searchPartners = search => dispatch =>
  searchPartnerByName(dispatch, search, partnersSearchLoading, receiveSearchPartners)


export const getPartnersRealTime = (segmentId) => dispatch =>
  get('partners', { segmentIds: segmentId }, { 'priority': 'asc' }, dispatch, true, request, received)

export const PARTNERS_SELECT = 'PARTNERS_SELECT'
export const selectPartner = partner => ({
  type: PARTNERS_SELECT,
  partner,
})

export const SELECTED_FOR_CHAT = 'SELECTED_FOR_CHAT'
export const selectForChat = (partner, image) => ({
  type: SELECTED_FOR_CHAT,
  partner,
  image
})

export const REMOVE_CHAT_IMAGE = 'REMOVE_CHAT_IMAGE'
export const removeChatImage = (partnerId, image) => ({
  type: REMOVE_CHAT_IMAGE,
  partnerId,
  image
})

export const updateFbAcessToken = (fbId, fbAcessToken) => dispatch =>
  partnerUpdateFbAcessToken(dispatch, fbId, fbAcessToken)

export const checkLoggedInIsPartner = (fbId) => dispatch => {
  return checkIsPartner(dispatch, fbId)
}

