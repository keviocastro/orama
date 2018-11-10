export const ADD_MESSAGES = 'ADD_MESSAGES'
export const addMessages = (messages, partnerId) => ({
    type: ADD_MESSAGES,
    messages,
    partnerId
})