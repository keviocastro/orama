import React from 'react';
import { FlatList, Text, ActivityIndicator, View, Image } from 'react-native';
import PropTypes from 'prop-types';

import { GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import { Card, CardItem, Body } from 'native-base';

export default class PartnerFeedScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.partner.name,
  });

  constructor(props) {
    super(props);

    this.state = {
      feed: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.getFeed();
  }

  getFeed() {
    const { params } = this.props.navigation.state;
    const token = params.partner.auth.accessToken;
    const infoRequest = new GraphRequest(
      '/me/feed',
      {
        accessToken: token,
        parameters: {
          fields: {
            string:
              'type,story,picture,full_picture,message,message_tags,attachments{type,media,url}',
          },
          limit: {
            string: '3',
          },
        },
      },
      (error, result) => {
        if (error) {
          console.log(`Error fetching data: ${JSON.stringify(error)}`);
        } else {
          this.setState({ feed: result.data, loading: false });
        }
      },
    );

    new GraphRequestManager().addRequest(infoRequest).start();
  }

  renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View>
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  renderCardMessage = item => (
    <CardItem>
      <Body>
        <Text>{item.message}</Text>
      </Body>
    </CardItem>
  );

  renderCardVideo = item => (
    <CardItem cardBody>
      <Image source={{ uri: item.full_picture }} style={{ height: 200, width: null, flex: 1 }} />
    </CardItem>
  );

  renderCardPhoto = item => (
    <CardItem>
      <Text>Photo album</Text>
    </CardItem>
  );

  renderItem = ({ item }) => (
    <Card>
      <CardItem>
        <Text>Debug: {item.type}</Text>
      </CardItem>
      {item.message && this.renderCardMessage(item)}
      {item.type === 'video' && this.renderCardVideo(item)}
      {item.type === 'photo' && this.renderCardPhoto(item)}
    </Card>
  );

  render = () => (
    <FlatList
      data={this.state.feed}
      keyExtractor={item => item.id}
      renderItem={this.renderItem}
      ListFooterComponent={this.renderFooter}
    />
  );
}

PartnerFeedScreen.propTypes = {
  navigation: PropTypes.object,
};
