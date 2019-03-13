import { add } from './api'

export const sendPost = (text, image, partnerId) => dispatch =>
  add('posts', { text, image, partner_id: partnerId }, dispatch, postCreated, errorPostCreate, sending)

export const CLEAR_FORM = 'CLEAR_FORM'
export const clearForm = (sending) => ({
  type: CLEAR_FORM
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