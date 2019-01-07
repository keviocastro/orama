import React from 'react'
import { Text } from 'react-native'
import { connect } from 'react-redux'
import { ListItem, Left, Right, Body } from 'native-base'

class PartnerChatScreen extends React.PureComponent {
  render() {
    return (
      <ListItem avatar>
        <Left>
          <Thumbnail source={{ uri: 'Image URL' }} />
        </Left>
        <Body>
          <Text>Kévio Castro</Text>
          <Text note>Olá, eu gostaria de...</Text>
        </Body>
        <Right>
          <Text note>15:02</Text>
        </Right>
      </ListItem>
    )
  }
}

const mapStateToProps = (state) => ({

})

export default connect(mapStateToProps)(PartnerChatScreen)