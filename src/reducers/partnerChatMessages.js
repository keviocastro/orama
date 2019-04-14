import { PARTNER_CHAT_MESSAGES_LOADING, PARTNER_CHAT_MESSAGES_RECEVED, SELECT_PARTNER_CHAT } from '../actions/partnerChatMessages'
import { GiftedChat } from 'react-native-gifted-chat'

const initialState = {
  messages: {},
  loading: false
};

// FIXME: Resolver problema do indice para não usar isso
// Operation was rejected because the system is not in a state required for the operation`s execution. (firestore/failed-precondition).
const sortMessages = (messages) => {
  return messages.sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  })
}

const mergeMessages = (state, action, userId) => {
  let messages = { ...state.messages }
  let newMessages = action.messages
  // FIXME: Uma mesma mensagem está sendo recebida mais de uma vez. Verificar porque está acontecendo isso com firebase query realtime
  if (userId in messages &&
    Array.isArray(messages[userId]) &&
    messages[userId].length > 0) {
    newMessages = newMessages.filter(newMessage => {
      let exist = false
      messages[userId].forEach(currentMessage => {
        if (currentMessage._id === newMessage._id) {
          exist = true
        }
      });

      return !exist
    })
  }

  if (Array.isArray(newMessages) && newMessages.length > 0) {
    messages[userId] = GiftedChat.append(messages[userId], newMessages)
  }

  return messages
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case PARTNER_CHAT_MESSAGES_RECEVED:
      return {
        ...state,
        messages: mergeMessages(state, action, action.userId),
        loading: false,
      };
    case PARTNER_CHAT_MESSAGES_LOADING:
      return {
        ...state,
        loading: action.loading,
      }
    case SELECT_PARTNER_CHAT:
      return {
        ...state,
        chatSelected: action.chat
      }
    default:
      return state;
  }
};

export default reducer;
