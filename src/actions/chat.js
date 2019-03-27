import { add, createChatIfNotExists as createChatIfNotExistsApi } from './api'

export const ADD_MESSAGES = 'ADD_MESSAGES'
export const addMessages = (messages, partner) => ({
    type: ADD_MESSAGES,
    messages,
    partner
})

export const RECEIVE_MESSAGES = 'RECEIVE_MESSAGES'
export const receiveMessages = (conversations) => ({
    type: RECEIVE_MESSAGES,
    conversations
})

export const ADD_CHATS = 'ADD_CHATS'
export const addChats = (chats) => ({
    type: ADD_CHATS,
    chats
})

export const createChatIfNotExists = (partner, user) => dispatch =>
    createChatIfNotExistsApi(dispatch, partner, user)

export const sendMessages = (messages, partner) => dispatch => {
    dispatch(addMessages(messages, partner))
    return add('messages', messages)
}