import React from 'react';
import PropTypes from 'prop-types';
import { StackNavigator, addNavigationHelpers } from 'react-navigation';
import { connect } from 'react-redux';
import SegmentScreen from './../screens/SegmentScreen';
import PartnerScreen from './../screens/PartnerScreen';
import PartnerFeedScreen from './../screens/PartnerFeedScreen';
import ChatScreen from './../screens/ChatScreen';

export const Navigator = StackNavigator({
  Home: { screen: SegmentScreen },
  Partner: { screen: PartnerScreen },
  PartnerFeed: { screen: PartnerFeedScreen },
  Chat: { screen: ChatScreen }
});

const AppWithNavigationState = props => (
  <Navigator
    navigation={addNavigationHelpers({
      dispatch: props.dispatch,
      state: props.nav,
    })}
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
