import React from 'react'
import { ImageBackground, StyleSheet } from 'react-native'
import { imageBackground } from './styles';

class UserLoginScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Login',
  })

  render() {
    return (<ImageBackground style={imageBackground} source={require('./../static/background-pass.png')} >
      <View style={styles.container}>
        <Text>User login</Text>
      </View>
    </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  }
});

const mapStateToProps = (state) => ({
  pass: state.auth.pass,
  invalidPass: state.auth.invalidPass,
  partner: state.auth.partner,
  user: state.auth.user
})

export default connect(mapStateToProps)(UserLoginScreen)
