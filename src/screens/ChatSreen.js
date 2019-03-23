import React from 'react'
import { View, Image, FlatList, ImageBackground } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { sendMessage } from '../actions/chat';
import { backgroundImage } from './styles';

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
                    avatar: this.props.partner.logo
                }
            },
            {
                _id: Math.random() * 1000,
                text: "O que podemos fazer por você hoje?",
                createdAt: new Date(),
                user: {
                    _id: this.props.partner.id,
                    name: this.props.partner.name,
                    avatar: this.props.partner.logo
                }
            }
        ].reverse()

        if (!recentMessage) {
            if (this.props.partner.welcome_messages == undefined) {
                this.props.dispatch(sendMessage(defaultMessages, this.props.partner.id))
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
                                avatar: this.props.partner.logo
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
                                avatar: this.props.partner.logo
                            }
                        }
                    }).reverse()
                }

                this.props.dispatch(sendMessage(messages, this.props.partner.id))
            }
        }
    }

    onSend(newMessages = []) {
        this.props.dispatch(sendMessage(newMessages, this.props.partner.id))
    }

    renderImage(image) {
        return <Image style={{
            height: 100,
            width: 200
        }} source={{ uri: image.src }} />
    }

    renderImages() {
        if (this.props.hasOwnProperty('images') && this.props.images.length > 0) {
            return <View style={{ height: 100 }}>
                <FlatList
                    horizontal={true}
                    data={this.props.images}
                    keyExtractor={(image, index) => index.toString()}
                    renderItem={({ item }) => this.renderImage(item)}
                />
            </View>
        } else {
            return null
        }
    }

    render() {
        return (
            <ImageBackground style={backgroundImage} source={require('./../static/background.png')} >
                <View style={{ flex: 1 }}>
                    {this.renderImages()}
                    <GiftedChat
                        contentContainerStyle={{ height: 100 }}
                        style={{ height: 500 }}
                        messages={this.props.messages}
                        onSend={messages => this.onSend(messages)}
                        user={{
                            _id: 0,
                        }}
                    />
                </View>
            </ImageBackground>
        )
    }
}

ChatSreen.propTypes = {
    partner: PropTypes.object,
    navigation: PropTypes.object
};

const mapStateToProps = state => {
    let messages = []
    let images = []

    if (state.chat.messages.hasOwnProperty(state.partners.partnerSelectedForChat.id)) {
        messages = state.chat.messages[state.partners.partnerSelectedForChat.id]
    }


    if (state.partners.imagesChatByPartner.hasOwnProperty(state.partners.partnerSelectedForChat.id)) {
        images = state.partners.imagesChatByPartner[state.partners.partnerSelectedForChat.id]
    }

    return ({
        partner: state.partners.partnerSelectedForChat,
        images: images,
        messages: messages
    })
}

export default connect(mapStateToProps)(ChatSreen);