import { ADD_MESSAGES } from "./../actions/chat"
import { GiftedChat } from 'react-native-gifted-chat'

const initialState = {
    messages: {}
}

const mergeMessages = (state, action) => {
    messages = { ...state.messages } 
    messages[action.partnerId] = GiftedChat.append(messages[action.partnerId], action.messages)
    return messages
}

const reducer = (state = initialState, action) => {
    switch(action.type){
        case ADD_MESSAGES: 
            return {
                ...state,
                messages: mergeMessages(state, action)
            }
        default:
            return  state
    }
}

export default reducer