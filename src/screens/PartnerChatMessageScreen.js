import React from 'react'
import { View, Image, FlatList, ImageBackground, TouchableOpacity } from 'react-native'
import { GiftedChat } from 'react-native-gifted-chat'
import { connect } from 'react-redux'
import { backgroundImage } from './styles'
import { getPartnerChatMessages, sendMessages } from '../actions/partnerChatMessages'
import md5 from 'md5'

class PartnerChatMessageScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.chat.user_name
  });

  constructor(props) {
    super(props)

    this.state = {
      modalVisible: false,
      modalImage: null
    }
  }

  componentDidMount() {
    if (this.props.messages.length === 0) {
      this.props.dispatch(getPartnerChatMessages(this.user.id, this.partner.id))
    }
  }

  get chat() {
    return this.props.navigation.state.params.chat
  }

  get partner() {
    return { id: this.chat.partner_id, name: this.chat.partner_name }
  }

  get user() {
    return { id: this.chat.user_id, name: this.chat.user_name }
  }

  onSend(newMessages = []) {
    newMessages = newMessages.map(message => {
      message.partner_id = this.props.partner.id
      message.user_id = this.user.id

      return message
    })
    this.props.dispatch(sendMessages(newMessages, this.partner, this.user))
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
        <View style={{ flex: 1 }}>
          {this.renderImages()}
          <GiftedChat
            contentContainerStyle={{ height: 100 }}
            style={{ height: 500 }}
            messages={this.props.messages}
            onSend={messages => this.onSend(messages)}
            user={{
              _id: this.props.partner.id,
              name: this.props.partner.name,
              avatar: this.props.partner.logo
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

  return ({
    partner: state.auth.partner,
    images: images,
    messages: state.partnerChatMessages.messages
  })
}

export default connect(mapStateToProps)(PartnerChatMessageScreen);