import React from 'react'
import PropTypes from 'prop-types'
import { createStackNavigator } from 'react-navigation'
import { connect } from 'react-redux'
import SegmentScreen from './../screens/SegmentScreen'
import PartnerScreen from './../screens/PartnerScreen'
import PartnerFeedScreen from './../screens/PartnerFeedScreen'
import ChatSreen from './../screens/ChatSreen'
import LoginScreen from './../screens/LoginScreen'
import PartnerChatScreen from './../screens/PartnerChatScreen'
import FeedImageScreen from '../screens/FeedImageScreen';
import PartnerAccountScreen from '../screens/PartnerAccountScreen';
import PartnerPostScreen from '../screens/PartnerPostScreen'

export const ModeCardStack = createStackNavigator({
  Home: { screen: SegmentScreen },
  Partner: { screen: PartnerScreen },
  PartnerFeed: { screen: PartnerFeedScreen },
  Chat: { screen: ChatSreen },
  Login: { screen: LoginScreen },
  PartnerChat: { screen: PartnerChatScreen },
  PartnerAccount: { screen: PartnerAccountScreen },
  PartnerPost: { screen: PartnerPostScreen }
});

export const Navigator = createStackNavigator(
  {
    Home: { screen: ModeCardStack, navigationOptions: { header: null } }
  },
  {
    FeedImage: { screen: FeedImageScreen }
  },
  { mode: 'modal' }
);

const AppWithNavigationState = props => (
  <Navigator
    navigation={{
      dispatch: props.dispatch,
      state: props.nav,
      addListener: () => { }
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
