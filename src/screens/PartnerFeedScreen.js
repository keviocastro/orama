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
import { selectForChat } from './../actions/partners'
import { Header } from 'react-navigation'
import ImageZoom from 'react-native-image-pan-zoom'
import { getRealtimeByPartner } from './../actions/posts'

const viewportHeight = Dimensions.get('window').height - Header.HEIGHT
const mainFeedImageHeight = viewportHeight - (viewportHeight * 0.3)
const mainFeedImageWidth = Dimensions.get('window').width

const styles = StyleSheet.create({
  card: { paddingBottom: 2, paddingBottom: 2 },
  image: { height: 200, width: null, flex: 1, resizeMode: 'stretch' },
  mainFeedImage: {
    resizeMode: 'stretch',
    height: mainFeedImageHeight
  }
})

class PartnerFeedScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.partner.name,
  })

  componentWillMount() {
    this.props.dispatch(getRealtimeByPartner(this.props.partnerId))
  }

  onClickItemCard = (image) => {
    this.props.dispatch(selectForChat(this.partner, image))
    this.props.navigation.navigate('Chat', { partner: this.partner })
  }

  renderLoading = () => {
    if (!this.props.loading) return null

    return (
      <View>
        <ActivityIndicator animating size="large" />
      </View>
    )
  }

  renderItemPost({ item, index }) {
    return (
      <TouchableOpacity onPress={() => this.onClickItemCard(item.image)}>
        <Card styles={styles.card}>
          {item.text !== undefined && item.text !== null > 0 &&
            <CardItem >
              <Body>
                <Text>{item.text}</Text>
              </Body>
            </CardItem>}
          {item.image !== undefined && item.text !== null > 0 &&
            <CardItem cardBody style={styles.card}>
              <Image source={{ uri: item.image }} style={styles.image} />
            </CardItem>
          }
        </Card>
      </TouchableOpacity>
    )
  }

  renderFeedImage() {
    if (this.props.navigation.state.params.partner !== undefined &&
      typeof this.props.navigation.state.params.partner.feed_image === 'string' &&
      this.props.navigation.state.params.partner.feed_image.length > 0)
      return <ImageZoom cropWidth={mainFeedImageWidth}
        cropHeight={mainFeedImageHeight}
        imageWidth={mainFeedImageWidth}
        imageHeight={mainFeedImageHeight}>
        <Image style={styles.mainFeedImage}
          source={{ uri: this.props.navigation.state.params.partner.feed_image }} />
      </ImageZoom>
    else
      return null
  }

  render = () => (
    <View>
      <FlatList
        ListHeaderComponent={() => this.renderFeedImage()}
        data={this.props.posts}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => this.renderItemPost({ item, index })}
      />
      {this.renderLoading()}
    </View>
  )
}

PartnerFeedScreen.propTypes = {
  navigation: PropTypes.object,
  dispatch: PropTypes.func
}

const mapStateToProps = (state) => ({
  loading: state.posts.loading,
  posts: state.posts.posts
})

export default connect(mapStateToProps)(PartnerFeedScreen)