import { get } from './api'

export const HIGHLIGHTS_RECEIVED = 'HIGHLIGHTS_RECEIVED'
export const received = (partners) => ({
  type: HIGHLIGHTS_RECEIVED,
  partners
})
export const HIGHLIGHTS_REQUEST = 'HIGHLIGHTS_REQUEST'
export const request = () => ({
  type: HIGHLIGHTS_REQUEST
})

export const getHighlights = () => dispatch =>
  get('partners', { 'highlighted': true }, {}, dispatch, false, request, received)