import React from 'react';
import SegmentScreen from './../screens/SegmentScreen';
import PartnerScreen from './../screens/PartnerScreen';
import { StackNavigator } from 'react-navigation';

const Navigator = StackNavigator({
  Home: { screen: SegmentScreen },
  Partner: { screen: PartnerScreen }
});

export default Navigator;