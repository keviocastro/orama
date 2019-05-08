import React from 'react'
import { Text, View, Linking } from 'react-native'
import { connect } from 'react-redux';
import { Button } from 'native-base';

class PartnerNotifyScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Notificações'
  })

  get partner() {
    if (typeof this.props.navigation.state.params.partner.notification_credits !== 'number') {
      this.props.navigation.state.params.partner.notification_credits = 0
    }
    return this.props.navigation.state.params.partner
  }

  get phone() {
    return ''
  }

  render() {
    return (
      <View style={{ flex: .9, justifyContent: 'space-around', alignItems: 'center' }}>
        <View>
          <Text style={{ fontSize: 20 }}>Você tem {this.partner.notification_credits} créditos de notificação</Text>
        </View>
        <View style={{ flex: .1, alignItems: 'center' }}>
          <Text>Ligue para diquirir mais créditos</Text>
          <Button style={{ width: 200, justifyContent: 'center', marginTop: 20 }}
            info
            onPress={() => { Linking.openURL(`tel:062994764853`) }}>
            <Text style={{ fontSize: 25, color: 'white' }}>Ligar</Text>
          </Button>
        </View>
        {this.partner.notification_credits > 0 &&
          < View style={{ flex: .1, alignItems: 'center' }}>
            <Button style={{ width: 200, justifyContent: 'center', marginTop: 20 }}
              info
              onPress={() => { this.props.navigation.navigate('Post', { partner: this.partner, title: 'Envio de notificação', notify: true }) }}>
              <Text style={{ fontSize: 20, color: 'white' }}>Enviar notificação</Text>
            </Button>
          </View>}
        < View style={{ flex: .1, alignItems: 'center' }}>
          <Button style={{ width: 200, justifyContent: 'center', marginTop: 20 }}
            info
            onPress={() => this.props.navigation.navigate('PartnerNotification', { partner: this.partner })} >
            <Text style={{ fontSize: 20, color: 'white' }}>Minhas notificação</Text>
          </Button>
        </View>
      </View >
    )
  }
}

export default connect()(PartnerNotifyScreen)