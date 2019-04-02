import { ADD_MESSAGES, RECEIVE_MESSAGES, ADD_CHATS } from "./../actions/chat"
import { GiftedChat } from 'react-native-gifted-chat'

const initialState = {
    messages: {},
    conversations: {},
    chats: []
}

const mergeMessages = (state, action) => {
    messages = { ...state.messages }
    messages[action.partner.id] = GiftedChat.append(messages[action.partner.id], action.messages)
    return messages
}

const sortConversations = (conversations) => {
    return Object.keys(conversations).sort((a, b) => {
        return (conversations[a].meta.read === conversations[b].meta.read) ? 0 : a ? -1 : 1
    })
}

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case ADD_MESSAGES:
            return {
                ...state,
                messages: mergeMessages(state, action)
            }
        case RECEIVE_MESSAGES:
            return {
                ...state,
                conversations: sortConversations(action.conversations)
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