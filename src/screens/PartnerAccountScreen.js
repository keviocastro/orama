import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Text, Button } from 'native-base'
import { View, StyleSheet } from 'react-native'
import { HeaderBackButton } from 'react-navigation'

const styles = StyleSheet.create({
  lineButtons: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginLeft: 20,
    marginRight: 20
  },
  button: {
    width: 150,
  },
  buttonText: {
    textAlign: 'center',
    textAlignVertical: 'center'
  }
})

class PartnerAccountScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.partner.name,
    headerLeft: (<HeaderBackButton onPress={() => { navigation.navigate('Home') }} />)
  })

  onPressChat() {
    this.props.navigation.navigate('PartnerChat')
  }

  onPressPost() {
    this.props.navigation.navigate('PartnerPost')
  }

  onPressNotfy() {

  }

  onPressLogout() {

  }

  render() {
    return (
      <View style={{ flex: 1, paddingTop: 40 }} >
        <View style={styles.lineButtons}  >
          <Button style={styles.button} info onPress={() => this.onPressChat()}><Text style={styles.buttonText}>Atendimento</Text></Button>
          <Button style={styles.button} info onPress={() => this.onPressPost()}><Text style={styles.buttonText}>Postagens</Text></Button>
        </View>
        <View style={styles.lineButtons}>
          <Button style={styles.button} info onPress={() => this.onPressNotfy()}><Text style={styles.buttonText}>Notificações</Text></Button>
          <Button style={styles.button} info onPress={() => this.onPressLogout()}><Text style={styles.buttonText}>Sair da conta</Text></Button>
        </View>
      </ View >
    )
  }
}

PartnerAccountScreen.propTypes = {
  navigation: PropTypes.object,
  dispatch: PropTypes.func
}

const mapToProps = state => ({
  loggedPartner: state.auth.partner
})

export default connect(mapToProps)(PartnerAccountScreen)