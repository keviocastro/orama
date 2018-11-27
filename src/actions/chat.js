export const SHOW_WELCOME_MESSAGES = 'SHOW_WELCOME_MESSAGES';
export const showWelcomeMessages = (partner) => ({
  type: SHOW_WELCOME_MESSAGES,
  partner: partner
});

export const SEND_MESSAGES = 'SEND_MESSAGES';
export const sendMessages = (messages, user) => ({
  type: SEND_MESSAGES,
  user: user,
  messages
})