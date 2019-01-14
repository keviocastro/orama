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
                conversations: action.conversations
            }
        default:
            return state
    }
}

export default reducer