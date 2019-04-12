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
import PartnerAccountScreen from './../screens/PartnerAccountScreen'
import PartnerPostScreen from './../screens/PartnerPostScreen'
import UserLoginScreen from './../screens/UserLoginScreen'
import PostScreen from './../screens/PostScreen'
import ImageViewScreen from './../screens/ImageViewScreen'
import PartnerSearchScreen from './../screens/PartnerSearchScreen'
import PartnerChatMessageScreen from './../screens/PartnerChatMessageScreen'
import PartnerNotifyScreen from './../screens/PartnerNotifyScreen'

export const ModeCardStack = createStackNavigator({
  Home: { screen: SegmentScreen, navigationOptions: { gesturesEnabled: true } },
  Partner: { screen: PartnerScreen, navigationOptions: { gesturesEnabled: true } },
  PartnerFeed: { screen: PartnerFeedScreen, navigationOptions: { gesturesEnabled: true } },
  Chat: { screen: ChatSreen, navigationOptions: { gesturesEnabled: true } },
  Login: { screen: LoginScreen },
  PartnerChat: { screen: PartnerChatScreen, navigationOptions: { gesturesEnabled: true } },
  PartnerAccount: { screen: PartnerAccountScreen, navigationOptions: { gesturesEnabled: true } },
  PartnerPost: { screen: PartnerPostScreen, navigationOptions: { gesturesEnabled: true } },
  UserLogin: { screen: UserLoginScreen, navigationOptions: { gesturesEnabled: true } },
  Post: { screen: PostScreen, navigationOptions: { gesturesEnabled: true } },
  ImageView: {
    screen: ImageViewScreen, navigationOptions: {
      gesturesEnabled: true,
      headerTintColor: 'white',
      headerStyle: {
        backgroundColor: 'black'
      }
    }
  },
  PartnerSearch: { screen: PartnerSearchScreen, navigationOptions: { gesturesEnabled: true } },
  PartnerChatMessage: { screen: PartnerChatMessageScreen, navigationOptions: { gesturesEnabled: true } },
  PartnerNotify: { screen: PartnerNotifyScreen, navigationOptions: { gesturesEnabled: true } }
});

export const Navigator = createStackNavigator(
  {
    Home: { screen: ModeCardStack, navigationOptions: { header: null, gesturesEnabled: true } }
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
