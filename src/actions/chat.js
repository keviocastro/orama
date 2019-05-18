import {
    add,
    get,
    createChatIfNotExists as createChatIfNotExistsApi,
    updateChatLastMessage as updateChatLastMessageApi,
    updateChatImages as updateChatImagesApi
} from './api'

export const CHAT_MESSAGES_LOADING = 'CHAT_MESSAGES_LOADING'
export const loading = (loading) => ({
    type: CHAT_MESSAGES_LOADING,
    loading
})

export const ADD_MESSAGES = 'ADD_MESSAGES'
export const addMessages = (messages, partner) => ({
    type: ADD_MESSAGES,
    messages,
    partner
})

export const CHAT_RECEIVED_MESSAGES = 'CHAT_RECEIVED_MESSAGES'
export const receiveMessages = (messages, filter) => ({
    type: CHAT_RECEIVED_MESSAGES,
    messages,
    partnerId: filter.partner_id,
    userId: filter.user_id,
})

// FIXME: Refactor para action especifica partnerChatMessages 
export const ADD_CHATS = 'ADD_CHATS'
export const addChats = (chats) => ({
    type: ADD_CHATS,
    chats
})

export const updateChatLastMessage = (messages, partner, user) => dispatch =>
    updateChatLastMessageApi(messages, partner, user)

export const updateChatImages = (partner, user, images) => dispatch =>
    updateChatImagesApi(partner.id, user.id, images)

export const createChatIfNotExists = (partner, user) => dispatch =>
    createChatIfNotExistsApi(dispatch, partner, user)

export const sendMessages = (messages) => dispatch => {
    return add('messages', messages)
}

export const getMessages = (partner_id, user_id) => dispatch =>
    get('messages', { partner_id, user_id }, {}, dispatch, true, loading, receiveMessages)
