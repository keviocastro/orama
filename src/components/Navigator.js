import React from 'react'
import PropTypes from 'prop-types'
import { createStackNavigator } from 'react-navigation'
import { connect } from 'react-redux'
import SegmentScreen from './../screens/SegmentScreen'
import PartnerScreen from './../screens/PartnerScreen'
import PartnerFeedScreen from './../screens/PartnerFeedScreen'
import ExternalChatScreen from './../screens/ExternalChatScreen'
import ChatSreen from './../screens/ChatSreen'

export const ModeCardStack = createStackNavigator({
  Home: { screen: SegmentScreen },
  Partner: { screen: PartnerScreen },
  PartnerFeed: { screen: PartnerFeedScreen },
  Chat: { screen: ChatSreen }
});

export const Navigator = createStackNavigator(
  {
    Home: { screen: ModeCardStack, navigationOptions: { header: null } },
    ExternalChat: { screen: ExternalChatScreen, navigationOptions: { header: null } }
  },
  { mode: 'modal' }
);

const AppWithNavigationState = props => (
  <Navigator
    navigation={{
      dispatch: props.dispatch,
      state: props.nav,
      addListener: () => {}
    }}
  />
);

AppWithNavigationState.propTypes = {
  dispatch: PropTypes.func,
  nav: PropTypes.object,
};

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);
