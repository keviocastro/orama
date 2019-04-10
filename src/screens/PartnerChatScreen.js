import React from 'react'
import { Text, FlatList, ImageBackground } from 'react-native'
import { connect } from 'react-redux'
import { ListItem, Left, Right, Body, Thumbnail } from 'native-base'
import firebase from 'react-native-firebase'
import { addChats } from './../actions/chat'
import { backgroundImage } from './styles';

import moment from 'moment'
import momentPt from 'moment/locale/pt-br'
moment.locale('pt-br', momentPt)

class PartnerChatScreen extends React.PureComponent {
  static navigationOptions = {
    title: 'Meus atendimentos'
  }

  componentDidMount() {
    firebase
      .firestore()
      .collection('chats')
      .where("partner_id", "==", this.partner.id)
      .onSnapshot(snapshot => {
        this.props.dispatch(addChats(snapshot.docs.map(doc => doc.data())))
      })
  }

  get partner() {
    return this.props.navigation.state.params.partner
  }

  onPressChat(chat) {
    this.props.navigation.navigate('PartnerChatMessage', { chat: chat })
  }

  renderListItem(chat) {
    let fontWeight = chat.unread && chat.unread > 0 ? 'bold' : 'normal'
    let avatar = chat.user_avatar && chat.user_avatar.lenth > 1
      ? <Thumbnail source={{ uri: chat.user_avatar }} />
      : <Thumbnail source={require('./../static/avatar.png')} />
    let time = chat.time && chat.time > 0 ? chat.time : new Date().getTime()

    return (
      <ListItem avatar
        onPress={() => { this.onPressChat(chat) }}
        style={{ backgroundColor: 'transparent' }} >
        <Left>
          {avatar}
        </Left>
        <Body>
          <Text>{chat.user_name}</Text>
          <Text style={{ fontWeight: fontWeight }}>{chat.last_message}</Text>
        </Body>
        <Right>
          <Text note>{moment(time.getTime()).fromNow()}</Text>
        </Right>
      </ListItem>
    )
  }

  render() {
    return (
      <ImageBackground style={backgroundImage} source={require('./../static/background.png')} >
        <FlatList
          data={this.props.chats}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => this.renderListItem(item)} />
      </ImageBackground>
    )
  }
}

const mapToProps = state => ({
  chats: state.chat.chats
})

export default connect(mapToProps)(PartnerChatScreen)