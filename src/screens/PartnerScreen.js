import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  View,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Linking,
  Modal,
} from 'react-native';
import { Card, CardItem, Thumbnail, Text, Button, Left, Body, Right, Icon } from 'native-base';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getPartners } from '../actions/partners';

const styles = {
  image: {
    height: 200,
    width: null,
    flex: 1,
  },
  emptyState: {
    container: {
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      paddingLeft: 56,
      paddingRight: 56,
    },
  },
  chatIcon: {
    fontSize: 37,
  },
};

// TODO: refatorar para componentes de container e visuais
// TODO: despachar getPartners somente se necessário
// TODO: melhorar Touchable
// TODO: analisar se compensa utilizar ionicons
class PartnerScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.segment.name,
  });

  componentWillMount() {
    this.props.dispatch(getPartners(this.segment.id));
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.requestError) {
      Alert.alert('Request Error', nextProps.requestError);
    }
  }

  onPressPost(item) {
    this.props.navigation.navigate('PartnerFeed', { partner: item });
  }

  openAppLink(link) {
    Linking.canOpenURL(link)
      .then((supported) => {
        if (supported) {
          Linking.openURL(link);
        } else {
          console.log('Device does not have support to open link '.link);
        }
      })
      .catch(err => console.log('onPressMessengerIcon: ', err));
  }

  onPressMessengerIcon(item) {
    this.openAppLink(`https://www.messenger.com/t/${item.fb_user_name}`);
  }

  onPressWhatsAppIcon(item) {
    this.openAppLink(`https://www.messenger.com/t/${item.phone_number}`);
  }

  get segment() {
    return this.props.navigation.state.params.segment;
  }

  keyExtrator = item => item.id;

  renderCardItemBody = (item) => {
    if (!Object.prototype.hasOwnProperty.call(item, 'latest_posts')) return null;

    return (
      <View>
        <TouchableOpacity onPress={() => this.onPressPost(item)}>
          <CardItem cardBody>
            <Image source={{ uri: item.latest_posts[0].image.uri }} style={styles.image} />
          </CardItem>
        </TouchableOpacity>
        <CardItem>
          <Left>
            <Button transparent>
              <Icon active name="map-marker-radius" />
              <Text>2,1 km</Text>
            </Button>
          </Left>
          <Right>
            <Button transparent onPress={this.onPressMessengerIcon(item)}>
              <Icon active name="facebook-messenger" style={styles.chatIcon} />
            </Button>
          </Right>
          <Right style={styles.containerIcons} onPress={this.onPressWhatsAppIcon(item)}>
            <Button transparent>
              <Icon active name="whatsapp" style={styles.chatIcon} />
            </Button>
          </Right>
        </CardItem>
      </View>
    );
  };

  renderItem = ({ item }) => (
    <Card>
      <TouchableOpacity onPress={() => this.onPressPost(item)}>
        <CardItem>
          <Left>
            <Thumbnail source={{ uri: item.logo.uri }} />
            <Body>
              <Text>{item.name}</Text>
              <Text note>{item.subtitle}</Text>
            </Body>
          </Left>
        </CardItem>
      </TouchableOpacity>
      {this.renderCardItemBody(item)}
    </Card>
  );

  renderFooter = () => {
    if (!this.props.isFetching) return null;

    return (
      <View>
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  renderEmptyState = () => (
    <View style={styles.emptyState.container}>
      <View>
        <Icon active name="md-walk" style={styles.emptyState.icon} />
      </View>
      <View>
        <Text>Esta categoria ainda está sem parceiros. Estamos correndo para inclui-los.</Text>
      </View>
    </View>
  );

  render() {
    if (this.props.partners.length <= 0 && this.props.isFetching === false) {
      return this.renderEmptyState();
    }

    return (
      <FlatList
        data={this.props.partners}
        keyExtractor={this.keyExtrator}
        renderItem={this.renderItem}
        ListFooterComponent={this.renderFooter}
      />
    );
  }
}

PartnerScreen.propTypes = {
  navigation: PropTypes.object,
  dispatch: PropTypes.func,
  partners: PropTypes.array,
  isFetching: PropTypes.bool,
  requestError: PropTypes.string,
};

const mapStateToProps = (state) => {
  let props = {};
  const segmentId = state.partners.currentSegmentId;

  const hasPartnersBySegment = Object.prototype.hasOwnProperty.call(
    state.partners.bySegment,
    segmentId,
  );

  props = hasPartnersBySegment
    ? {
      isFetching: state.partners.bySegment[segmentId].isFetching,
      partners: state.partners.bySegment[segmentId].data,
      requestError: state.partners.bySegment[segmentId].requestError,
    }
    : {
      isFetching: true,
      partners: [],
      requestError: '',
    };

  return props;
};

export default connect(mapStateToProps)(PartnerScreen);
