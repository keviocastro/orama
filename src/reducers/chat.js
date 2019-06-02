import {
    ADD_MESSAGES,
    CHAT_RECEIVED_MESSAGES,
    ADD_CHATS,
    PARTNER_CHAT_SELECT_CHAT,
    ADD_NOTIFICATION_MESSAGE,
    ADD_TEXT_MESSSAGE
} from "./../actions/chat"
import { GiftedChat } from 'react-native-gifted-chat'

const initialState = {
    messages: {},
    conversations: {},
    chats: [],
    CHAT_RECEIVED_MESSAGES: false,
    notification: null,
    textMessage: null,
    textMessagePartner: null
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
                CHAT_RECEIVED_MESSAGES: false,
                messages: mergeMessages(state, action, action.partner.id)
            }
        case CHAT_RECEIVED_MESSAGES:
            return {
                ...state,
                CHAT_RECEIVED_MESSAGES: true,
                messages: mergeMessages(state, action, action.partnerId)
            }
        case ADD_CHATS:
            return {
                ...state,
                CHAT_RECEIVED_MESSAGES: false,
                chats: Array.isArray(action.chats) ? action.chats : [action.chats]
            }
        case ADD_NOTIFICATION_MESSAGE:
            return {
                ...state,
                notification: action.notification
            }
        case ADD_TEXT_MESSSAGE:
            return {
                ...state,
                textMessage: action.text,
                textMessagePartner: action.partner
            }
        default:
            return state
    }
}

export default reducer