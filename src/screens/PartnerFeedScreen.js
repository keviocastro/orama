import React from 'react';
import {
  FlatList,
  Text,
  ActivityIndicator,
  View,
  Image,
  StyleSheet,
  TouchableNativeFeedback,
  Linking,
} from 'react-native';
import PropTypes from 'prop-types';

import { Card, CardItem, Body } from 'native-base';

import PartnerFeedService from './../services/PartnerFeedService';

const styles = StyleSheet.create({
  cardImage: { height: 200, width: null, flex: 1 },
  cardItem: { paddingBottom: 2 },
});

/**
 * @todo Refactore: exportar compoentes CardItemMessage, CardItemVideo , CardItemPhoto, ....
 */
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

  onClickItemCard = () => {
    const url = `https://www.messenger.com/t/${this.partner.fb_user_name}`;
    Linking.canOpenURL(url).then((suported) => {
      if (suported) {
        Linking.openURL(url);
      } else {
        console.log(`db.jsonDon 't know how to open URI: ${url}`);
      }
    });
  };

  get partner() {
    return this.props.navigation.state.params.partner;
  }

  getFeed() {
    PartnerFeedService.getPartnerFeed(this.partner.fb_id, (result, error) => {
      console.log(result);
      if (error) {
        console.log('PartnerFeedScreen error: ', error);
        return false;
      }

      this.setState({
        feed: result.data,
        loading: false,
      });
    });
  }

  renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View>
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  renderCardItemMessage = (post, key) => (
    <CardItem key={key}>
      <Body>
        <Text>{post.message}</Text>
      </Body>
    </CardItem>
  );

  renderCardItemVideo = (media, key) => (
    <CardItem cardBody key={key}>
      <Image source={{ uri: media.media.image.src }} style={styles.cardImage} />
    </CardItem>
  );

  renderCardItemPhoto = (attachment, key) => (
    <CardItem cardBody key={key} style={styles.cardItem}>
      <Image source={{ uri: attachment.media.image.src }} style={styles.cardImage} />
    </CardItem>
  );

  /**
   * @todo Render para avatar, profile_data e link
   */
  renderCardItemByMeidaType = (media, key) => {
    let cardItem = null;
    switch (media.type) {
      case 'video':
      case 'video_autoplay':
      case 'video_inline':
        cardItem = this.renderCardItemVideo(media, key);
        break;
      case 'photo':
        cardItem = this.renderCardItemPhoto(media, key);
        break;
      case 'album':
        cardItem = media.subattachments.data.map((albumMedia, index) =>
          this.renderCardItemByMeidaType(albumMedia, index));
        break;
      case 'avatar':
      case 'profile_media':
      case 'link':
      default:
        cardItem = null;
        break;
    }

    return cardItem;
  };

  /**
   * Todas as midias associadas com o post
   * @see https://developers.facebook.com/docs/graph-api/reference/v2.10/post section Edges
   */
  renderCardItensAttachments = attachments =>
    attachments.map((attachment, index) => this.renderCardItemByMeidaType(attachment, index));

  renderItem = ({ item }) => (
    <TouchableNativeFeedback
      onPress={this.onClickItemCard}
      background={TouchableNativeFeedback.SelectableBackground()}
    >
      <Card>
        {item.message && this.renderCardItemMessage(item)}
        {item.attachments && this.renderCardItensAttachments(item.attachments.data)}
      </Card>
    </TouchableNativeFeedback>
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
