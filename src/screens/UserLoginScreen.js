import React from 'react'
import {
  ImageBackground,
  TextInput,
  View,
  Dimensions,
  StyleSheet,
  ActivityIndicator
} from 'react-native'
import { Button, Text } from 'native-base'
import { connect } from 'react-redux';
import { backgroundImage } from './styles'
import DeviceInfo from 'react-native-device-info'
import { selectForChat } from './../actions/partners';
import { userLogin, redirectToChat } from './../actions/auth'
import TextInputMask from 'react-native-text-input-mask'

const contentWidth = Dimensions.get('window').width - 10

class UserLoginScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Login',
  })

  constructor(props) {
    super(props)

    this.state = { validPhoneNumber: false };
  }

  get partner() {
    return this.props.navigation.state.params.partner
  }

  get goBack() {
    return this.props.navigation.state.params.goBack
  }

  get chatImage() {
    return this.props.navigation.state.params.image
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.user !== null && nextProps.redirectToChat) {
      this.props.dispatch(redirectToChat(false))
      this.props.dispatch(selectForChat(this.partner, null))
      this.props.navigation.navigate('Chat', { partner: this.partner, image: this.chatImage, goBack: this.goBack })
    }
  }

  onPressLogin() {
    this.props.dispatch(userLogin({ phone: this.inputPhone.value, name: this.inputName.value }))
  }

  render() {
    return (<ImageBackground style={backgroundImage} source={require('./../static/background-pass.png')} >
      <View style={styles.container}>
        <TextInputMask
          refInput={input => { this.inputPhone = input }}
          label="Seu número de celular"
          placeholder="Seu número de celular"
          value={DeviceInfo.getPhoneNumber()}
          style={{ ...styles.input }}
          onChangeText={(formatted, extracted) => {
            if (extracted.length < 11) {
              this.setState({
                validPhoneNumber: false
              })
            } else {
              this.setState({
                validPhoneNumber: true
              })
            }

            this.inputPhone.value = extracted
          }}
          mask={"([00]) [0] [0000]-[0000]"}
        />
        {/* <TextInput
          ref={input => { this.inputPhone = input }}
          label="Seu número de celular"
          placeholder="Seu número de celular"
          style={{ ...styles.input }}
          value={DeviceInfo.getPhoneNumber()}
          onChangeText={(text) => {
            this.inputPhone.value = text
          }} /> */}
        <TextInput
          label="Seu nome"
          placeholder="Seu nome"
          ref={input => { this.inputName = input }}
          style={styles.input}
          onChangeText={(text) => {
            this.inputName.value = text
          }} />
        <View style={styles.containerButton}>
          {!this.props.loading && this.state.validPhoneNumber && <Button info onPress={() => this.onPressLogin()}><Text>Entrar</Text></Button>}
          {this.props.loading && <ActivityIndicator animating size="large" style={{ marginTop: 40, marginBottom: 40 }} />}
        </View>
      </View>
    </ImageBackground>
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
  input: {
    height: 40,
    width: contentWidth,
    borderColor: '#3787c4',
    borderWidth: 2,
    marginTop: 10
  },
  containerButton: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 100
  }
})

const mapStateToProps = (state) => ({
  invalidPhone: state.auth.invalidPhone,
  loading: state.auth.userLoginloading,
  user: state.auth.user,
  redirectToChat: state.auth.redirectToChat
})

export default connect(mapStateToProps)(UserLoginScreen)
