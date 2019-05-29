import React from 'react'
import { View, Image, FlatList, ImageBackground, TouchableOpacity, Dimensions, Linking } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import { connect } from 'react-redux'
import {
    sendMessages,
    createChatIfNotExists,
    updateChatLastMessage,
    getMessages,
    updateChatImages,
    addNotificationMessage
} from '../actions/chat'
import { removeChatImage, addChatImage } from './../actions/partners' // FIXME: Refactor para actions/chat
import { selectedPartnerForFeed } from './../actions/posts'
import { backgroundImage } from './styles'
import md5 from 'md5'
import ChatImages from '../components/ChatImages'
import { HeaderBackButton } from 'react-navigation'
import Hyperlink from 'react-native-hyperlink'

const fullWidth = Dimensions.get('window').height

class ChatSreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.partner.name,
        headerLeft: (<HeaderBackButton onPress={() => {
            let goBack = navigation.state.params.goBack
            if (goBack) {
                switch (goBack) {
                    case 'PartnerFeed':
                        navigation.dispatch(selectedPartnerForFeed(navigation.state.params.partner))
                        navigation.navigate('PartnerFeed', { partner: navigation.state.params.partner })
                        break;
                    case 'Home':
                        navigation.navigate('Home')
                    default:
                        navigation.goBack()
                        break;
                }
            } else {
                navigation.goBack()
            }
        }} />)
    });

    constructor(props) {
        super(props)

        this.state = {
            modalVisible: false,
            modalImage: null,
            sendWelcomeMessages: true
        }
    }

    sendWelcomeMessages() {
        let defaultMessages = [
            {
                _id: Math.random() * 1000,
                text: "Olá",
                createdAt: new Date(),
                user: {
                    _id: this.props.partner.id,
                    name: this.props.partner.name,
                    avatar: this.props.partner.logo
                },
                partner_id: this.props.partner.id,
                user_id: this.props.user.id,
                welcome: true
            },
            {
                _id: Math.random() * 1000,
                text: "O que podemos fazer por você hoje?",
                createdAt: new Date(),
                user: {
                    _id: this.props.partner.id,
                    name: this.props.partner.name,
                    avatar: this.props.partner.logo
                },
                partner_id: this.props.partner.id,
                user_id: this.props.user.id,
                welcome: true
            }
        ]

        if (this.props.partner.welcome_messages === undefined ||
            typeof this.props.partner.welcome_messages === 'string' &&
            this.props.partner.welcome_messages.trim().length === 0) {

            this.props.dispatch(sendMessages(defaultMessages, this.props.partner, this.props.user))
            this.props.dispatch(updateChatLastMessage(defaultMessages, this.props.partner, this.props.user))
        } else {
            messages = defaultMessages

            if (typeof this.props.partner.welcome_messages === 'string') {
                messages = this.props.partner.welcome_messages.split(/\r?\n/)
                messages = messages.map((msg) => {
                    return {
                        _id: Math.random() * 1000,
                        text: msg,
                        createdAt: new Date(),
                        user: {
                            _id: this.props.partner.id,
                            name: this.props.partner.name,
                            avatar: this.props.partner.logo
                        },
                        partner_id: this.props.partner.id,
                        user_id: this.props.user.id,
                        welcome: true
                    }
                })
            }

            if (Array.isArray(this.props.partner.welcome_messages)) {
                messages = this.props.partner.welcome_messages.map((msg) => {
                    return {
                        _id: Math.random() * 1000,
                        text: msg,
                        createdAt: new Date(),
                        user: {
                            _id: this.props.partner.id,
                            name: this.props.partner.name,
                            avatar: this.props.partner.logo
                        },
                        partner_id: this.props.partner.id,
                        user_id: this.props.user.id,
                        welcome: true
                    }
                })
            }

            this.props.dispatch(sendMessages(messages, this.props.partner, this.props.user))
            this.props.dispatch(updateChatLastMessage(messages, this.props.partner, this.props.user))
        }
    }

    get partner() {
        return this.props.navigation.state.params.partner
    }

    componentWillReceiveProps(nextProps) {
        this.props.dispatch(updateChatImages(nextProps.partner, nextProps.user, nextProps.images))
        if (nextProps.received_messages && nextProps.messages.length === 0 && this.state.sendWelcomeMessages) {
            this.setState({
                sendWelcomeMessages: false
            })
            this.sendWelcomeMessages()
        }
    }

    componentDidMount() {
        if (this.props.notification !== null &&
            this.partner.id === this.props.notification.data.partner_id) {
            addNotificationMessage(null)
            let message = {
                _id: Math.random() * 1000,
                text: this.props.notification.data.body,
                createdAt: new Date(),
                user: {
                    _id: this.props.user.id,
                    name: this.props.user.name
                },
                partner_id: this.props.partner.id,
                user_id: this.props.user.id
            };

            this.onSend([message]);

            if (typeof this.props.notification.data.image === 'string' &&
                this.props.notification.data.image.length > 10) {
                addChatImage(this.partner.id, this.props.notification.data.image)
            }
        }

        this.props.dispatch(updateChatImages(this.partner, this.props.user, this.props.images))
    }

    componentWillMount() {
        this.props.dispatch(createChatIfNotExists(this.partner, this.props.user))
        if (this.props.messages.length === 0) {
            this.props.dispatch(getMessages(this.partner.id, this.props.user.id))
        }

    }

    onSend(newMessages = []) {

        newMessages = newMessages.map(message => {
            message.partner_id = this.props.partner.id
            message.user_id = this.props.user.id

            return message
        })
        this.props.dispatch(sendMessages(newMessages, this.partner, this.props.user))
        this.props.dispatch(updateChatLastMessage(newMessages, this.partner, this.props.user))
    }

    renderImage(image) {
        return <TouchableOpacity onPress={() => {
            Image.getSize(image, (width, height) => {
                this.setState({
                    modalVisible: true,
                    modalImage: imagem,
                    modalImagemHeight: (width / fullWidth) * height
                })
            })
        }}>
            <Image style={{
                height: 100,
                width: 200,
                resizeMode: 'cover'
            }} source={{ uri: image }} />
        </TouchableOpacity>
    }

    renderImages() {
        if (this.props.hasOwnProperty('images') && this.props.images.length > 0) {
            return <View style={{ height: 100 }}>
                <FlatList
                    horizontal={true}
                    data={this.props.images}
                    keyExtractor={(image) => md5(image)}
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
                    <ChatImages images={this.props.images} onRemove={(image) => {
                        this.props.dispatch(removeChatImage(this.partner.id, image))
                    }} />
                    <GiftedChat
                        contentContainerStyle={{ height: 100 }}
                        style={{ height: 500 }}
                        messages={this.props.messages}
                        onSend={messages => this.onSend(messages)}
                        user={{
                            _id: this.props.user.id,
                            name: this.props.user.name,
                            avatar: this.props.user.avatar
                        }}
                    />
                </View>
            </ImageBackground>
        )
    }
}

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
        messages: messages,
        user: state.auth.user,
        received_messages: state.chat.CHAT_RECEIVED_MESSAGES,
        notification: state.chat.notification
    })
}

export default connect(mapStateToProps)(ChatSreen);