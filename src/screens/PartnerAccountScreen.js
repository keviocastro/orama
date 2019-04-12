import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Text, Button } from 'native-base'
import { View, StyleSheet, ImageBackground, Dimensions } from 'react-native'
import { HeaderBackButton } from 'react-navigation'
import { partnerLogoff } from './../actions/auth'
import { backgroundImage } from './styles'
import { clearPosts, getRealtimeByPartner } from '../actions/posts'

const contentWidth = Dimensions.get('window').width - 20

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
    height: 45,
    justifyContent: 'center',
    width: contentWidth
  },
  buttonExit: {
    justifyContent: 'center',
    width: 200,
  },
  buttonText: {
    height: 45,
    fontSize: 25,
    paddingTop: 10,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'Impact'
  }
})

class PartnerAccountScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.partner.name,
    headerLeft: (<HeaderBackButton onPress={() => { navigation.navigate('Home') }} />)
  })

  componentDidMount() {
    if (this.props.posts.length === 0) {
      this.props.dispatch(getRealtimeByPartner(this.props.partner.id))
    }
  }

  onPressChat() {
    this.props.navigation.navigate('PartnerChat', { partner: this.props.partner })
  }

  onPressPost() {
    this.props.navigation.navigate('PartnerPost', { partner: this.props.partner })
  }

  onPressNotfy() {
    this.props.navigation.navigate('PartnerNotify', { partner: this.props.partner })
  }

  onPressNewPost() {
    this.props.navigation.navigate('Post', { partner: this.props.partner, title: 'Nova postagem' })
  }

  onPressLogout() {
    this.props.dispatch(partnerLogoff())
    this.props.dispatch(clearPosts())
    this.props.navigation.navigate('Login')
  }

  render() {
    return (
      <ImageBackground style={backgroundImage} source={require('./../static/background.png')} >
        <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', paddingTop: 40, paddingLeft: 10 }} >
          <Button style={styles.button} info onPress={() => this.onPressChat()}>
            <Text style={styles.buttonText}>Atendimento</Text>
          </Button>
          <Button style={styles.button} info onPress={() => this.onPressNewPost()}>
            <Text style={styles.buttonText}>Nova postagem</Text>
          </Button>
          <Button style={styles.button} info onPress={() => this.onPressPost()}>
            <Text style={styles.buttonText}>Minhs Postagens</Text>
          </Button>
          <Button style={styles.button} info onPress={() => this.onPressNotfy()}>
            <Text style={styles.buttonText}>Notificações</Text>
          </Button>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <Button style={styles.buttonExit} info onPress={() => this.onPressLogout()}>
              <Text style={styles.buttonText}>Sair da conta</Text>
            </Button>
          </View>
        </View>
      </ImageBackground>
    )
  }
}

PartnerAccountScreen.propTypes = {
  navigation: PropTypes.object,
  dispatch: PropTypes.func
}

const mapToProps = state => ({
  partner: state.auth.partner,
  posts: state.posts.posts
})

export default connect(mapToProps)(PartnerAccountScreen)