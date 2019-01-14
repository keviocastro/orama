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