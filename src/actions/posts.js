import { add, on } from './api'

export const getOnUpdate = (partnerId) => dispatch =>
  on('posts', { partner_id: partnerId }, { 'created_at': 'desc' }, dispatch, loading, received)

export const sendPost = (text, image, partnerId) => dispatch =>
  add('posts', { text, image, partner_id: partnerId }, dispatch, postCreated, errorPostCreate, sending)

export const CLEAR_FORM = 'CLEAR_FORM'
export const clearForm = (sending) => ({
  type: CLEAR_FORM
})

export const RECEIVED = 'RECEIVED'
export const received = (posts) => ({
  type: RECEIVED,
  posts
})

export const LOADING = 'LOADING'
export const loading = (loading) => ({
  type: LOADING,
  loading
})

export const SELECT_IMAGE = 'SELECT_IMAGE'
export const selectImage = (image) => ({
  type: SELECT_IMAGE,
  image
})

export const SENDING = 'SENDING'
export const sending = (sending) => ({
  type: SENDING,
  sending
})

export const POST_CREATED = 'POST_CREATED'
export const postCreated = (post) => ({
  type: POST_CREATED,
  post
})

export const ERROR_POST_CREATE = 'ERROR_POST_CREATE'
export const errorPostCreate = (error) => ({
  type: ERROR_POST_CREATE,
  error
})