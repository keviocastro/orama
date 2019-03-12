import React, { Component } from 'react'
import { StyleSheet, TextInput, Dimensions, View } from 'react-native'
import { H3, Button, Text } from 'native-base'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { partnerLogin } from './../actions/auth'

const contentWidth = Dimensions.get('window').width - 10

class LoginScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Login',
  })

  componentWillReceiveProps(nextProps) {
    if (nextProps.partner !== null) {
      this.props.navigation.navigate('PartnerAccount', { partner: nextProps.partner })
    }
  }

  onPressLogin() {
    this.props.dispatch(partnerLogin(this.state.pass))
  }

  render() {
    return (
      <View style={styles.container}>
        <H3>Sua senha</H3>
        <TextInput
          label="Sua senha"
          value={this.props.pass}
          style={{ height: 40, width: contentWidth, borderColor: 'gray', borderWidth: 1 }}
          autoComplete="password"
          onChangeText={(text) => {
            this.setState({ pass: text })
          }}
          secureTextEntry={true}
        />
        {this.props.invalidPass === true && <Text style={{ color: 'red' }}>Senha inválida</Text>}
        <View style={{ alignItems: 'center', justifyContent: 'center', height: 100 }}>
          <Button info onPress={() => this.onPressLogin()}><Text>Entrar</Text></Button>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'blue',
  },
})

LoginScreen.propTypes = {
  navigation: PropTypes.object,
  dispatch: PropTypes.func,
}

const mapStateToProps = (state) => ({
  pass: state.auth.pass,
  invalidPass: state.auth.invalidPass,
  partner: state.auth.partner
})

export default connect(mapStateToProps)(LoginScreen)