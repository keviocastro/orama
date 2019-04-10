import { get } from './api';
export const PARTNER_CHAT_MESSAGES_RECEVED = 'PARTNER_CHAT_MESSAGES_RECEVED';
export const received = messages => ({
  type: PARTNER_CHAT_MESSAGES_RECEVED,
  messages,
});

export const PARTNER_CHAT_MESSAGES_LOADING = 'PARTNER_CHAT_MESSAGES_LOADING';
export const loading = (loading) => ({
  type: PARTNER_CHAT_MESSAGES_LOADING,
  loading
});

export const getPartnerChatMessages = (user_id, partner_id) => dispatch =>
  get('messages', { user_id, partner_id }, {}, dispatch, true, loading, received)
