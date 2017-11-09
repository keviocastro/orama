import React from 'react';
import PropTypes from 'prop-types';
import { View, Image, FlatList, ActivityIndicator, TouchableNativeFeedback } from 'react-native';
import { Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body } from 'native-base';

import PartnerService from './../services/PartnerService';

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

export default class PartnerScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.segment.name,
  });

  constructor(props) {
    super(props);

    this.partnerService = PartnerService;
    this.state = {
      partners: [],
      loading: true,
      empty: false,
    };
  }

  componentDidMount() {
    this.partnerService.getPartnersBySegment((partnersJson) => {
      if (this.state.partners.length === 0 && partnersJson.length === 0) {
        this.setState({ partners: partnersJson, loading: false, empty: true });
      } else {
        this.setState({ partners: partnersJson, loading: false, empty: false });
      }
    }, this.segment.id);
  }

  onPressPost(item) {
    this.props.navigation.navigate('PartnerFeed', { partner: item });
  }

  get segment() {
    return this.props.navigation.state.params.segment;
  }

  keyExtrator = item => item.id;

  renderItem = ({ item }) => (
    <Card>
      <CardItem>
        <Left>
          <Thumbnail source={{ uri: item.logo.uri }} />
          <Body>
            <Text>{item.name}</Text>
            <Text note>{item.subtitle}</Text>
          </Body>
        </Left>
      </CardItem>
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
    </Card>
  );

  renderFooter = () => {
    if (!this.state.loading) return null;

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
    if (this.state.empty) return this.renderEmptyState();

    return (
      <FlatList
        data={this.state.partners}
        keyExtractor={this.keyExtrator}
        renderItem={this.renderItem}
        ListFooterComponent={this.renderFooter}
      />
    );
  }
}

PartnerScreen.propTypes = {
  navigation: PropTypes.object,
};