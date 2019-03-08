import React from 'react'
import {
  FlatList,
  Text,
  ActivityIndicator,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Card, CardItem, Body } from 'native-base'
import PartnerFeedService from './../services/PartnerFeedService'
import { selectForChat } from './../actions/partners'
import { Header } from 'react-navigation'
import ImageZoom from 'react-native-image-pan-zoom';

const viewportHeight = Dimensions.get('window').height - Header.HEIGHT
const mainFeedImageHeight = viewportHeight - (viewportHeight * 0.3)
const mainFeedImageWidth = Dimensions.get('window').width

const styles = StyleSheet.create({
  cardImage: { height: 200, width: null, flex: 1 },
  cardItem: { paddingBottom: 2 },
  mainFeedImage: {
    resizeMode: 'stretch',
    height: mainFeedImageHeight
  }
})

class PartnerFeedScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.partner.name,
  })

  constructor(props) {
    super(props)

    this.state = {
      feed: [],
      loading: true,
    }
  }

  componentDidMount() {
    this.getFeed()
  }

  onClickItemCard = (image) => {
    this.props.dispatch(selectForChat(this.partner, image))
    this.props.navigation.navigate('Chat', { partner: this.partner })
  }

  get partner() {
    return this.props.navigation.state.params.partner
  }

  getFeed() {
    PartnerFeedService.getPartnerFeed(this.partner, (result, error) => {
      if (error) {
        console.log('PartnerFeedScreen error: ', error)
        return false
      }

      if (typeof result.error === 'object') {
        if (result.error.code === 190) {
          alert('Esta empresa precisa logar no facebook através do O-rama para autorizar leitura do seu feed.');
        }

        result.data = [null];
      }

      this.setState({
        feed: result.data,
        loading: false,
      })
    })
  }

  renderFooter = () => {
    if (!this.state.loading) return null

    return (
      <View>
        <ActivityIndicator animating size="large" />
      </View>
    )
  }

  renderCardItemMessage = (post, key) => (
    <CardItem key={key}>
      <Body>
        <Text>{post.message}</Text>
      </Body>
    </CardItem>
  )

  renderCardItemVideo = (media, key) => (
    <CardItem cardBody key={key}>
      <Image source={{ uri: media.media.image.src }} style={styles.cardImage} />
    </CardItem>
  )

  renderCardItemPhoto = (attachment, key) => (
    <TouchableOpacity onPress={() => this.onClickItemCard(attachment.media.image)} >
      <CardItem cardBody key={key} style={styles.cardItem}>
        <Image source={{ uri: attachment.media.image.src }} style={styles.cardImage} />
      </CardItem>
    </TouchableOpacity>
  )

  renderCardItemByMediaType = (media, key) => {
    let cardItem = null
    switch (media.type) {
      case 'photo':
        cardItem = this.renderCardItemPhoto(media, key)
        break
      case 'album':
        cardItem = media.subattachments.data.map((albumMedia, index) =>
          this.renderCardItemByMediaType(albumMedia, index))
        break
      case 'video':
      case 'video_autoplay':
      case 'video_inline':
      case 'avatar':
      case 'profile_media':
      case 'link':
      default:
        cardItem = null
        break
    }

    return cardItem
  }

  /**
   * Todas as mídias associadas com o post
   * @see https://developers.facebook.com/docs/graph-api/reference/v2.10/post section Edges
   */
  renderCardItemsAttachments = attachments =>
    attachments.map((attachment, index) => this.renderCardItemByMediaType(attachment, index))

  renderItem = ({ item, index }) => {
    if (index === 0 && this.partner.feed_image && !Array.isArray(this.partner.feed_image)) {
      return <ImageZoom cropWidth={mainFeedImageWidth}
        cropHeight={mainFeedImageHeight}
        imageWidth={mainFeedImageWidth}
        imageHeight={mainFeedImageHeight}>
        <Image style={styles.mainFeedImage}
          source={{ uri: this.partner.feed_image }} />
      </ImageZoom>
    } else {
      let message = item.message ? this.renderCardItemMessage(item) : false
      let attachments = item.attachments ? this.renderCardItemsAttachments(item.attachments.data) : false
      if (message && attachments) {
        return <Card>
          {message}
          {attachments}
        </Card>
      }
    }
  }

  render = () => (
    <FlatList
      data={this.state.feed}
      keyExtractor={(item, index) => { return index.toString() }}
      renderItem={this.renderItem}
      ListFooterComponent={this.renderFooter}
    />
  )
}

PartnerFeedScreen.propTypes = {
  navigation: PropTypes.object,
}

const mapStateToProps = (state) => ({

})

export default connect(mapStateToProps)(PartnerFeedScreen)