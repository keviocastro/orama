import { PARTNER_CHAT_MESSAGES_LOADING, PARTNER_CHAT_MESSAGES_RECEVED } from '../actions/partnerChatMessages';

const initialState = {
  messages: [],
  loading: false
};

// FIXME: Resolver problema do indice para não usar isso
// Operation was rejected because the system is not in a state required for the operation`s execution. (firestore/failed-precondition).
const sortMessages = (messages) => {
  return messages.sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  })
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case PARTNER_CHAT_MESSAGES_RECEVED:
      return {
        ...state,
        messages: sortMessages(action.messages),
        loading: false,
      };
    case PARTNER_CHAT_MESSAGES_LOADING:
      return {
        ...state,
        loading: action.loading,
      };
    default:
      return state;
  }
};

export default reducer;
