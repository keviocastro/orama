import { add } from './api'

export const ADD_MESSAGES = 'ADD_MESSAGES'
export const addMessages = (messages, partnerId) => ({
    type: ADD_MESSAGES,
    messages,
    partnerId
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

export const sendMessage = (messages, partnerId) => dispatch => {
    dispatch(addMessages(messages, partnerId))
    return add('messages', messages, partnerId)
}