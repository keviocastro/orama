import { add, get, updateLatestPostsByPartner, remove } from './api'

export const getRealtimeByPartner = (partnerId) => dispatch =>
  get('posts', { partner_id: partnerId }, { 'created_at': 'desc' }, dispatch, true, loading, received)

export const getByPartner = (partnerId) => dispatch =>
  get('posts', { partner_id: partnerId }, { 'created_at': 'desc' }, dispatch, false, loading, received)

export const sendPost = (text, image, partnerId) => dispatch =>
  add('posts', { text, image, partner_id: partnerId }, dispatch, postCreated, errorPostCreate, sending)

export const updateLatestPosts = (partnerId, image) => dispatch =>
  updateLatestPostsByPartner(partnerId, image)

export const removePost = (postId) => dispatch =>
  remove('posts', postId)

export const CLEAR_FORM = 'CLEAR_FORM'
export const clearForm = (sending) => ({
  type: CLEAR_FORM
})

export const RECEIVED = 'RECEIVED'
export const received = (posts, filter) => ({
  type: RECEIVED,
  posts,
  filter
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

export const CLEAR_POSTS = 'CLEAR_POSTS'
export const clearPosts = () => ({
  type: CLEAR_POSTS
})

export const SELECTED_PARTNER_FOR_FEED = 'SELECTED_PARTNER_FOR_FEED'
export const selectedPartnerForFeed = (partner) => ({
  type: SELECTED_PARTNER_FOR_FEED,
  partner
})