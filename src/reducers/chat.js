import { ADD_MESSAGES, CHAT_RECEIVED_MESSAGES, ADD_CHATS, PARTNER_CHAT_SELECT_CHAT } from "./../actions/chat"
import { GiftedChat } from 'react-native-gifted-chat'

const initialState = {
    messages: {},
    conversations: {},
    chats: []
}

const mergeMessages = (state, action, partnerId) => {
    let messages = { ...state.messages }
    let newMessages = action.messages
    if (partnerId in messages &&
        Array.isArray(messages[partnerId]) &&
        messages[partnerId].length > 0) {
        newMessages = action.messages.filter(newMessage => {
            let exist = false
            messages[partnerId].forEach(currentMessage => {
                if (currentMessage._id === newMessage._id) {
                    exist = true
                }
            });

            return !exist
        })
    }
    if (Array.isArray(newMessages) && newMessages.length > 0) {
        messages[partnerId] = GiftedChat.append(messages[partnerId], newMessages)
    }
    return messages
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_MESSAGES:
            return {
                ...state,
                messages: mergeMessages(state, action, action.partner.id)
            }
        case CHAT_RECEIVED_MESSAGES:
            return {
                ...state,
                messages: mergeMessages(state, action, action.partnerId)
            }
        case ADD_CHATS:
            return {
                ...state,
                chats: Array.isArray(action.chats) ? action.chats : [action.chats]
            }
        default:
            return state
    }
}

export default reducer