import React, { Component } from 'react'
import { StyleSheet, TextInput, Dimensions, View, ActivityIndicator, ImageBackground } from 'react-native'
import { Button, Text } from 'native-base'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { partnerLogin, redirectToAccount, invalidPass } from './../actions/auth'
import { HeaderBackButton } from 'react-navigation'
import TextInputMask from 'react-native-text-input-mask'
import firebase from 'react-native-firebase'
const firestore = firebase.firestore()

const contentWidth = Dimensions.get('window').width - 10

class LoginScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Login',
    headerLeft: (<HeaderBackButton onPress={() => {
      navigation.navigate('Home')
      navigation.dispatch(invalidPass(false))
    }} />)
  })

  constructor(props) {
    super(props)

    this.state = { validPass: false, validIdOrama: false };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.partner !== null && nextProps.redirectToAccount) {
      this.props.navigation.navigate('PartnerAccount', { partner: nextProps.partner })
      this.props.dispatch(redirectToAccount(false))

      firebase.messaging().getToken()
        .then(fcmToken => {
          if (fcmToken) {

            firestore.collection('partners').doc(nextProps.partner.id)
              .update({
                cloud_message_token: fcmToken
              })
          }
        });
    }
  }

  onPressLogin() {
    this.props.dispatch(partnerLogin(this.inputPass.value, this.inputIdOrama.value))
  }

  render() {
    return (
      <ImageBackground style={styles.imageBackground} source={require('./../static/background-pass.png')} >
        <View style={styles.container}>
          <TextInput
            label="Seu Código O-RAMA"
            placeholder="ID O-RAMA"
            ref={input => { this.inputIdOrama = input }}
            value={this.props.idOrama}
            style={{ height: 40, width: contentWidth, borderColor: '#3787c4', borderWidth: 2 }}
            onChangeText={(text) => {
              this.inputIdOrama.value = text

              if (text.length >= 6) {
                this.setState({
                  validIdOrama: true
                })
              } else {
                this.setState({
                  validIdOrama: false
                })
              }
            }}
          />
          <TextInput
            label="Sua senha"
            placeholder="SENHA"
            ref={input => { this.inputPass = input }}
            value={this.props.pass}
            style={{ height: 40, width: contentWidth, borderColor: '#3787c4', borderWidth: 2 }}
            autoComplete="password"
            onChangeText={(text) => {
              this.inputPass.value = text

              if (text.length >= 3) {
                this.setState({
                  validPass: true
                })
              } else {
                this.setState({
                  validPass: false
                })
              }
            }}
            secureTextEntry={true}
          />
          {this.props.invalidPass === true && <Text style={{ color: 'red' }}>Código O-RAMA ou senha inválida</Text>}
          <View style={{ alignItems: 'center', justifyContent: 'center', height: 100 }}>
            {!this.props.loading && this.state.validPass && this.state.validIdOrama && < Button info onPress={() => this.onPressLogin()}><Text>Entrar</Text></Button>}
            {this.props.loading && <ActivityIndicator animating size="large" style={{ marginTop: 40, marginBottom: 40 }} />}
          </View>
        </View>
      </ImageBackground >
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageBackground: {
    resizeMode: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'blue',
  }
})

LoginScreen.propTypes = {
  navigation: PropTypes.object,
  dispatch: PropTypes.func,
}

const mapStateToProps = (state) => ({
  pass: state.auth.pass,
  invalidPass: state.auth.invalidPass,
  partner: state.auth.partner,
  loading: state.auth.partnerLoginLoading,
  redirectToAccount: state.auth.redirectToAccount
})

export default connect(mapStateToProps)(LoginScreen)