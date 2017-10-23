import { StackNavigator } from 'react-navigation';
import SegmentScreen from './../screens/SegmentScreen';
import PartnerScreen from './../screens/PartnerScreen';
import PartnerFeedScreen from './../screens/PartnerFeedScreen';

const Navigator = StackNavigator({
  Home: { screen: SegmentScreen },
  Partner: { screen: PartnerScreen },
  PartnerFeed: { screen: PartnerFeedScreen },
});

export default Navigator;
