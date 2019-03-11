import React, { Component } from 'react'
import { StyleSheet, ImageBackground, Text } from 'react-native'
import { connect } from 'react-redux'
import { LoginButton, AccessToken } from 'react-native-fbsdk'
import PropTypes from 'prop-types'
import { updateFbAcessToken, checkLoggedInIsPartner } from './../actions/partners'
import { addLoggedUser, removeLoggedUser } from './../actions/auth'

class LoginScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    header: null,
  })

  render() {
    return (
      <ImageBackground style={styles.container} source={require('./../static/empty-state.png')} >
        <LoginButton
          readPermissions={["user_posts"]}
          onLoginFinished={
            (error, result) => {
              if (error) {
                alert('Não é possível comunicar com facebook agora. Verifique sua conexão e tente novamente.')
              } else if (result.isCancelled) {
                // "login is cancelled."
              } else {
                AccessToken.getCurrentAccessToken().then(
                  (data) => {
                    if (data === null) {
                      this.props.dispatch(removeLoggedUser())
                    } else {
                      this.props.dispatch(updateFbAcessToken(data.userID, data.accessToken))
                      this.props.dispatch(checkLoggedInIsPartner(data.userID))
                      this.props.dispatch(addLoggedUser(data.userID, data.accessToken))
                    }
                    this.props.navigation.navigate('Home')
                  }
                )
              }
            }
          }
        />
      </ImageBackground >
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

})

export default connect(mapStateToProps)(LoginScreen)