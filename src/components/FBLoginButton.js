import React, { Component } from 'react'
import { View } from 'react-native'
import { LoginButton } from 'react-native-fbsdk'
import { connect } from 'react-redux'

export default class FBLoginButton extends Component {
  render() {
    return (
      <View>
        <LoginButton
          readPermissions={["email", "user_posts"]}
          onLoginFinished={
            (error, result) => {
              if (error) {
                alert('Não é possível comunicar com facebook agora. Verifique sua conexão e tente novamente.')
              } else {
                this.props.navigation.navigate('PartnerChat')
              }
            }
          }
        />
      </View>
    )
  }
}

export default connect()(FBLoginButton)
