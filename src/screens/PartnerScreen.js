import React from 'react';
import PropTypes from 'prop-types';
import { View, Image, FlatList, ActivityIndicator, TouchableNativeFeedback } from 'react-native';
import { Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body, Right } from 'native-base';

import PartnerService from './../services/PartnerService';

const styles = {
  image: {
    height: 200,
    width: null,
    flex: 1,
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
    };
  }

  componentDidMount() {
    this.partnerService.getPartners((partnersJson) => {
      this.setState({ partners: partnersJson, loading: false });
    });
  }

  onPressPost(item) {
    this.props.navigation.navigate('PartnerFeed', { partner: item });
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
            <Icon active name="thumbs-up" />
            <Text>12 Curtidas</Text>
          </Button>
        </Left>
        <Right>
          <Button transparent>
            <Icon active name="map" />
            <Text>{item.location.distance} km</Text>
          </Button>
        </Right>
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

  render() {
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
