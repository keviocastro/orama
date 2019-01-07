import React, { Component } from 'react'
import { StyleSheet, Text, View, ImageBackground } from 'react-native'
import { connect } from 'react-redux'
import FBLoginButton from './../components/FBLoginButton'
import PropTypes from 'prop-types'

class LoginScreen extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.segment.name,
  })

  render() {
    return (
      <ImageBackground style={styles.container} source={require('./../static/empty-state.png')} >
        <FBLoginButton />
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