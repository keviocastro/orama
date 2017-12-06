import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  View,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableNativeFeedback,
  Alert,
} from 'react-native';
import { Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body } from 'native-base';
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
    icon: {
      fontSize: 24,
    },
  },
};

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

  get segment() {
    return this.props.navigation.state.params.segment;
  }

  keyExtrator = item => item.id;

  renderCardItemBody = (item) => {
    if (!Object.prototype.hasOwnProperty.call(item, 'latest_posts')) return null;

    return (
      <View>
        <CardItem cardBody>
          <TouchableNativeFeedback
            onPress={() => this.onPressPost(item)}
            background={TouchableNativeFeedback.SelectableBackground()}
          >
            <Image source={{ uri: item.latest_posts[0].image.uri }} style={styles.image} />
          </TouchableNativeFeedback>
        </CardItem>
        <CardItem>
          <Left>
            <Button transparent>
              <Icon active name="md-time" />
              <Text>{item.latest_posts[0].created_at}</Text>
            </Button>
          </Left>
        </CardItem>
      </View>
    );
  };

  renderItem = ({ item }) => (
    <Card>
      <TouchableNativeFeedback
        onPress={() => this.onPressPost(item)}
        background={TouchableNativeFeedback.SelectableBackground()}
      >
        <CardItem>
          <Left>
            <Thumbnail source={{ uri: item.logo.uri }} />
            <Body>
              <Text>{item.name}</Text>
              <Text note>{item.subtitle}</Text>
            </Body>
          </Left>
        </CardItem>
      </TouchableNativeFeedback>
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

const mapStateToProps = state => ({
  isFetching: state.partners.isFetching,
  partners: state.partners.data,
  requestError: state.partners.requestError,
});

export default connect(mapStateToProps)(PartnerScreen);
