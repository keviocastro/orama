import { SHOW_WELCOME_MESSAGES, SEND_MESSAGES } from './../actions/chat';
import { GiftedChat } from 'react-native-gifted-chat';
import { PARTNERS_RECEIVED } from '../actions/partners';

const initialState = {
  welcome_messages: [],
  messages: []
}

const getWelcomeMessages = (partner) => {
  let messages = [];

  if (Object.prototype.hasOwnProperty.call(partner, 'chat_welcome_messages') && Array.isArray(partner.chat_welcome_messages)) {
    partner.chat_welcome_messages.forEach((msg) => {
      messages.push({
        _id: Math.round(Math.random() * 1000000),
        text: msg,
        createdAt: new Date(),
        user: {
          _id: partner.id,
          name: partner.name,
          avatar: partner.logo.uri,
        }
      });
    });
    return messages;
  } else {
    return [
      {
        _id: Math.round(Math.random() * 1000000),
        text: 'Estamos prontos para te atender',
        createdAt: new Date(),
        user: {
          _id: partner.id,
          name: partner.name,
          avatar: partner.logo.uri,
        },
      },
      {
        _id: Math.round(Math.random() * 1000000),
        text: 'Olá, :-)',
        createdAt: new Date(),
        user: {
          _id: partner.id,
          name: partner.name,
          avatar: partner.logo.uri,
        },
      },
    ];
  }
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SHOW_WELCOME_MESSAGES:
      return {
        ...state,
        messages: getWelcomeMessages(action.partner)
      }
    case SEND_MESSAGES:
      return {
        ...state,
        messages: GiftedChat.append(state.messages, action.messages)
      }
    default:
      return state;
  }
}


export default reducer;