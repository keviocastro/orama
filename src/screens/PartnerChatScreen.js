import React from 'react'
import { Text, FlatList, TouchableOpacity } from 'react-native'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { ListItem, Left, Right, Body, Thumbnail, Content } from 'native-base'
import firebase from 'react-native-firebase'
import { addChats } from './../actions/chat'

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
      .where("partner_id", "==", 22)
      .onSnapshot(snapshot => {
        this.props.dispatch(addChats(snapshot.docs.map(doc => doc.data())))
      })
  }

  onPressChat(chat) {
    this.props.navigation.navigate('Chat')
  }

  renderListItem(chat) {
    let fontWeight = chat.unread && chat.unread > 0 ? 'bold' : 'normal'
    let avatar = chat.client_avatar && chat.client_avatar.lenth > 1
      ? <Thumbnail source={{ uri: chat.client_avatar }} />
      : <Thumbnail source={require('./../static/avatar.png')} />
    let time = chat.time && chat.time > 0 ? chat.time : new Date().getTime()

    return (
      <TouchableOpacity onPress={() => { console.log('chat') }} >
        <ListItem avatar>
          <Left>
            {avatar}
          </Left>
          <Body>
            <Text>Kévio Castro</Text>
            <Text style={{ fontWeight: fontWeight }}>{chat.last_message}</Text>
          </Body>
          <Right>
            <Text note>{moment(time.getTime()).fromNow()}</Text>
          </Right>
        </ListItem>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <Content style={{ backgroundColor: 'white' }}>
        <FlatList
          data={this.props.chats}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => this.renderListItem(item)} />
      </Content>
    )
  }
}

PartnerChatScreen.propTypes = {
  navigation: PropTypes.object,
  dispatch: PropTypes.func
}

const mapToProps = state => ({
  chats: state.chat.chats
})

export default connect(mapToProps)(PartnerChatScreen)