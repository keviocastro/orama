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
import { userLogin } from './../actions/auth'

const contentWidth = Dimensions.get('window').width - 10

class UserLoginScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Login',
  })

  onPressLogin() {
    this.props.dispatch(userLogin({ phone: this.inputPhone.value, name: this.inputName.value }))
  }

  render() {
    return (<ImageBackground style={backgroundImage} source={require('./../static/background-pass.png')} >
      <View style={styles.container}>
        <TextInput
          ref={input => { this.inputPhone = input }}
          label="Seu número de celular"
          placeholder="Seu número de celular"
          style={{ ...styles.input }}
          value={DeviceInfo.getPhoneNumber()}
          onChangeText={(text) => {
            this.inputPhone.value = text
          }} />
        <TextInput
          label="Seu nome"
          placeholder="Seu nome"
          ref={input => { this.inputName = input }}
          style={styles.input}
          onChangeText={(text) => {
            this.inputName.value = text
          }} />
        <View style={styles.containerButton}>
          {!this.props.loading && <Button info onPress={() => this.onPressLogin()}><Text>Entrar</Text></Button>}
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
  loading: state.auth.loading,
  user: state.auth.user
})

export default connect(mapStateToProps)(UserLoginScreen)
