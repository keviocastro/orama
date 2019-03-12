import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { Text } from 'react-native'
import { HeaderBackButton } from 'react-navigation'

class PartnerAccountScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.partner.name,
    headerLeft: (<HeaderBackButton onPress={() => { navigation.navigate('Home') }} />)
  })

  render() {
    return (<Text>teste</Text>)
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