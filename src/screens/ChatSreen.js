import React from 'react'
import { View, Image, FlatList, ImageBackground, Modal, Text, TouchableOpacity, Alert, Dimensions } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { sendMessages, createChatIfNotExists, updateChatLastMessage } from '../actions/chat'
import { removeChatImage } from './../actions/partners';
import { backgroundImage } from './styles'
import ImageZoom from 'react-native-image-pan-zoom'
import md5 from 'md5'

class ChatSreen extends React.Component {
    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.partner.name
    });

    constructor(props) {
        super(props)

        this.state = {
            modalVisible: false,
            modalImage: null
        }
    }

    get partner() {
        return this.props.navigation.state.params.partner
    }

    componentDidMount() {
        this.props.dispatch(createChatIfNotExists(this.props.partner, this.props.user))
    }

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
        ].reverse()

        if (!recentMessage) {
            if (this.props.partner.welcome_messages == undefined) {
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
                            },
                            partner_id: this.props.partner.id,
                            user_id: this.props.user.id
                        }
                    }).reverse()
                }

                this.props.dispatch(sendMessages(messages, this.props.partner, this.props.user))
                this.props.dispatch(updateChatLastMessage(messages, this.props.partner, this.props.user))
            }
        }
    }

    onSend(newMessages = []) {

        newMessages = newMessages.map(message => {
            message.partner_id = this.props.partner.id
            message.user_id = this.props.user.id

            return message
        })
        this.props.dispatch(sendMessages(newMessages, this.props.partner, this.props.user))
        this.props.dispatch(updateChatLastMessage(newMessages, this.props.partner, this.props.user))
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
                width: 200
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
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setState({
                            modalVisible: false
                        })
                    }}>
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "black" }}>
                        <TouchableOpacity onPress={() => {
                            this.setState({
                                modalVisible: false
                            })
                            this.props.dispatch(removeChatImage(this.props.partner.id, this.state.modalImage))
                        }}>
                            <Image style={{ height: 30, width: 30, marginBottom: 10 }} source={require('./../static/icon-remove.png')} />
                        </TouchableOpacity>
                        <ImageZoom
                            cropWidth={modalImageWidth}
                            cropHeight={modalImagemHeight}
                            imageWidth={modalImageWidth}
                            imageHeight={modalImagemHeight} >
                            <Image style={{ width: modalImageWidth, height: modalImagemHeight, resizeMode: "stretch" }}
                                source={{ uri: this.state.modalImage }}
                            />
                        </ImageZoom>
                        <TouchableOpacity onPress={() => {
                            this.setState({
                                modalVisible: false
                            })
                        }}>
                            <Image style={{ width: 50, height: 50, marginTop: 10, backgroundColor: 'black' }} source={require('./../static/icon-down.png')} />
                        </TouchableOpacity>
                    </View>
                </Modal>
                <View style={{ flex: 1 }}>
                    {this.renderImages()}
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
        messages: messages,
        user: state.auth.user
    })
}

export default connect(mapStateToProps)(ChatSreen);