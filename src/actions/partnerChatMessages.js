import { get, add, update } from './api';
export const PARTNER_CHAT_MESSAGES_RECEVED = 'PARTNER_CHAT_MESSAGES_RECEVED';
export const received = (messages, filter) => ({
  type: PARTNER_CHAT_MESSAGES_RECEVED,
  messages,
  userId: filter.user_id,
  partnerId: filter.partner_id
});

export const PARTNER_CHAT_MESSAGES_LOADING = 'PARTNER_CHAT_MESSAGES_LOADING';
export const loading = (loading) => ({
  type: PARTNER_CHAT_MESSAGES_LOADING,
  loading
});

export const SELECT_PARTNER_CHAT = 'SELECT_PARTNER_CHAT'
export const selectPartnerChat = (chat) => ({
  type: SELECT_PARTNER_CHAT,
  chat
})

export const getPartnerChatMessages = (user_id, partner_id) => dispatch =>
  get('messages', { user_id, partner_id }, {}, dispatch, true, loading, received)

export const sendMessages = (messages, partner, user) => dispatch =>
  add('messages', messages)

export const setReadAllMessages = (chat) => dispatch =>
  update('chats', chat.id, { unread: 0 })