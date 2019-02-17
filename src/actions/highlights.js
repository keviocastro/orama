import { search } from './api'

export const HIGHLIGHTS_RECEIVED = 'HIGHLIGHTS_RECEIVED'
export const received = (partners) => ({
  type: HIGHLIGHTS_RECEIVED,
  partners
})
export const HIGHLIGHTS_REQUEST = 'HIGHLIGHTS_REQUEST'
export const request = () => ({
  type: HIGHLIGHTS_REQUEST
})
export const HIGHLIGHTS_REQUEST_ERROR = 'HIGHLIGHTS_REQUEST_ERROR'
export const requestError = error => ({
  type: HIGHLIGHTS_REQUEST_ERROR,
  error,
})
export const getHighlights = () => dispatch =>
  search('partners', dispatch, received, request, requestError, {
    field: 'highlighted',
    value: true,
  })