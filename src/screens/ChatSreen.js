import React from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { addMessages } from '../actions/chat';

class ChatSreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.partner.name
    });

    componentWillMount() {
        let recentMessage = false
        let timeLimiteWelcome = new Date()
        timeLimiteWelcome.setHours(timeLimiteWelcome.getHours() - 4)

        this.props.messages.forEach(msg => {
            if (msg.createdAt.getTime() > timeLimiteWelcome.getTime())
                recentMessage = true
        })
        let defaultMessages = [
            {
                _id: Math.random() * 1000,
                text: "Olá",
                createdAt: new Date(),
                user: {
                    _id: this.props.partner.id,
                    name: this.props.partner.name,
                    avatar: this.props.partner.logo.uri
                }
            },
            {
                _id: Math.random() * 1000,
                text: "O que podemos fazer por você hoje?",
                createdAt: new Date(),
                user: {
                    _id: this.props.partner.id,
                    name: this.props.partner.name,
                    avatar: this.props.partner.logo.uri
                }
            }
        ].reverse()

        if (!recentMessage) {
            if (this.props.partner.welcome_messages == undefined) {
                this.props.dispatch(addMessages(defaultMessages, this.props.partner.id))
            } else {
                messages = defaultMessages

                if (typeof this.props.partner.welcome_messages === 'string') {
                    messages = this.props.partner.welcome_messages.split(/\r?\n/)
                    messages = messages.map((msg) => {
                        return {
                            _id: Math.random() * 1000,
                            text: msg,
                            welcome: true,
                            createdAt: new Date(),
                            user: {
                                _id: this.props.partner.id,
                                name: this.props.partner.name,
                                avatar: this.props.partner.logo.uri
                            }
                        }
                    })
                    messages = messages.reverse()
                }

                if (Array.isArray(this.props.partner.welcome_messages)) {
                    messages = this.props.partner.welcome_messages.map((msg) => {
                        return {
                            _id: Math.random() * 1000,
                            text: msg,
                            welcome: true,
                            createdAt: new Date(),
                            user: {
                                _id: this.props.partner.id,
                                name: this.props.partner.name,
                                avatar: this.props.partner.logo.uri
                            }
                        }
                    }).reverse()
                }

                this.props.dispatch(addMessages(messages, this.props.partner.id))
            }
        }
    }

    onSend(newMessages = []) {
        this.props.dispatch(addMessages(newMessages, this.props.partner.id))
    }

    render() {
        return (
            <GiftedChat
                messages={this.props.messages}
                onSend={messages => this.onSend(messages)}
                user={{
                    _id: 0,
                }}
            />
        )
    }
}

ChatSreen.propTypes = {
    partner: PropTypes.object,
    navigation: PropTypes.object,
};

const mapStateToProps = state => {
    let messages = []
    if (state.chat.messages.hasOwnProperty(state.partners.partnerSelectedForChat.id)) {
        messages = state.chat.messages[state.partners.partnerSelectedForChat.id]
    }
    return ({
        partner: state.partners.partnerSelectedForChat,
        messages: messages
    })
}

export default connect(mapStateToProps)(ChatSreen);