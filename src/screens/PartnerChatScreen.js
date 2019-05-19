import React from 'react'
import { Text, FlatList, ImageBackground } from 'react-native'
import { connect } from 'react-redux'
import { ListItem, Left, Right, Body } from 'native-base'
import firebase from 'react-native-firebase'
import { addChats } from './../actions/chat'
import { selectPartnerChat } from './../actions/partnerChatMessages'
import { backgroundImage } from './styles'

import moment from 'moment'
import momentPt from 'moment/locale/pt-br'
moment.locale('pt-br', momentPt)

class PartnerChatScreen extends React.PureComponent {
  static navigationOptions = {
    title: 'Meus atendimentos'
  }

  componentDidMount() {
    if (this.props.chats.length === 0) {
      firebase
        .firestore()
        .collection('chats')
        .where("partner_id", "==", this.partner.id)
        .onSnapshot(snapshot => {
          this.props.dispatch(addChats(snapshot.docs.map(doc => {
            let data = doc.data()
            data.id = doc.id
            return data
          })))
        })
    }
  }

  get partner() {
    return this.props.navigation.state.params.partner
  }

  onPressChat(chat) {
    this.props.dispatch(selectPartnerChat(chat))
    this.props.navigation.navigate('PartnerChatMessage', { chat: chat })
  }

  renderListItem(chat) {
    let fontWeight = chat.unread && chat.unread > 0 ? 'bold' : 'normal'

    let time = typeof chat.time === 'object' ? chat.time : new Date().getTime()

    return (
      <ListItem
        onPress={() => { this.onPressChat(chat) }}
        style={{ backgroundColor: 'transparent', marginRight: 17 }} >
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