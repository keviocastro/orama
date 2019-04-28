import React from 'react'
import { View, Image, FlatList, ImageBackground, Modal, TouchableOpacity, Dimensions } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import { connect } from 'react-redux'
import { sendMessages, createChatIfNotExists, updateChatLastMessage, getMessages, updateChatImages } from '../actions/chat'
import { removeChatImage } from './../actions/partners' // FIXME: Refactor para actions/chat
import { selectedPartnerForFeed } from './../actions/posts'
import { backgroundImage } from './styles'
import md5 from 'md5'
import ChatImages from '../components/ChatImages'
import { HeaderBackButton } from 'react-navigation'
import firebase from 'react-native-firebase'

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
            modalImage: null
        }
    }

    sendWelcomeMessages() {
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
                },
                partner_id: this.props.partner.id,
                user_id: this.props.user.id
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
                user_id: this.props.user.id
            }
        ]

        if (!recentMessage) {
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
                            welcome: true,
                            createdAt: new Date(),
                            user: {
                                _id: this.props.partner.id,
                                name: this.props.partner.name,
                                avatar: this.props.partner.logo
                            },
                            partner_id: this.props.partner.id,
                            user_id: this.props.user.id
                        }
                    })
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
                            },
                            partner_id: this.props.partner.id,
                            user_id: this.props.user.id
                        }
                    })
                }

                this.props.dispatch(sendMessages(messages, this.props.partner, this.props.user))
                this.props.dispatch(updateChatLastMessage(messages, this.props.partner, this.props.user))
            }
        }
    }

    get partner() {
        return this.props.navigation.state.params.partner
    }

    componentWillReceiveProps(nextProps) {
        this.props.dispatch(updateChatImages(nextProps.partner, nextProps.user, nextProps.images))
    }

    componentDidMount() {
        this.props.dispatch(updateChatImages(this.partner, this.props.user, this.props.images))
    }

    componentWillMount() {
        this.props.dispatch(createChatIfNotExists(this.partner, this.props.user))
        if (this.props.messages.length === 0) {
            this.props.dispatch(getMessages(this.partner.id, this.props.user.id))
        }

        setTimeout(() => {
            this.sendWelcomeMessages()
        }, 3000)
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
            this.setState({
                modalVisible: true,
                modalImage: image
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

const viewportHeight = Dimensions.get('window').height
const modalImagemHeight = viewportHeight - (viewportHeight * 0.25)
const modalImageWidth = Dimensions.get('window').width

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
        user: state.auth.user
    })
}

export default connect(mapStateToProps)(ChatSreen);