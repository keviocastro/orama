import { ADD_MESSAGES, RECEIVE_MESSAGES } from "./../actions/chat"
import { GiftedChat } from 'react-native-gifted-chat'

const initialState = {
    messages: {},
    conversations: {}
}

const mergeMessages = (state, action) => {
    messages = { ...state.messages }
    messages[action.partnerId] = GiftedChat.append(messages[action.partnerId], action.messages)
    return messages
}

const sortConversations = (conversations) => {
    let conversationsOrderedByNoRead = {}
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
        default:
            return state
    }
}

export default reducer