import React from 'react'
import { Text, FlatList } from 'react-native'
import { connect } from 'react-redux'
import { ListItem, Left, Right, Body, Thumbnail, Content } from 'native-base'
import Moment from 'moment'
import firebase from 'react-native-firebase'
import { receiveMessages } from './../actions/chat'

const partnerId = 22

class PartnerChatScreen extends React.PureComponent {
  static navigationOptions = {
    title: 'Meus atendimentos'
  }

  constructor(props) {
    super(props)

    this.ref = firebase.firestore().collection('conversations')
      .onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          console.log(doc)
        })
      })

    this.unsubscribe = null
  }

  renderListItem(conversation) {
    let fontWeight = conversation.meta.read === true ? 'bold' : 'normal'
    return (
      <ListItem avatar>
        <Left>
          <Thumbnail source={{ uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVVyIAH2HBpwXRPWdSvqwEKselg6IWHw92qBg4-b-Z8CcgsGjBuA' }} />
        </Left>
        <Body>
          <Text>Kévio Castro</Text>
          <Text style={{ fontWeight: fontWeight }}>{conversation.meta.last_message}</Text>
        </Body>
        <Right>
          <Text note>{Moment(conversation.meta.time * 1000).fromNow()}</Text>
        </Right>
      </ListItem>
    )
  }

  render() {
    return (
      <Content style={{ backgroundColor: 'white' }}>
        <FlatList
          data={this.props.conversations}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => this.renderListItem(item)} />
      </Content>
    )
  }
}

const mapToProps = state => {
  let conversations = []

  if (state.chat && Object.keys(state.chat.conversations).length > 0) {
    Object.keys(state.chat.conversations).forEach(key => {
      if (key.startsWith(partnerId + '_')) conversations.push(state.chat.conversations[key])
    })
  }

  return {
    conversations
  }
}

export default connect(mapToProps)(PartnerChatScreen)