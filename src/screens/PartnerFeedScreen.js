import React from 'react'
import {
  FlatList,
  Text,
  ActivityIndicator,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  AsyncStorage
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Card, CardItem, Body } from 'native-base'
import { selectForChat } from './../actions/partners'
import { Header } from 'react-navigation'
import ImageZoom from 'react-native-image-pan-zoom'
import { getRealtimeByPartner, getByPartner } from './../actions/posts'
import { backgroundImage } from './styles';

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

class PartnerFeedScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.partner.name,
  })

  constructor(props) {
    super(props)

  }

  componentDidMount() {
    this.props.dispatch(getRealtimeByPartner(this.partner.id))
  }

  get partner() {
    return this.props.navigation.state.params.partner
  }

  onClickItemCard = (image) => {
    AsyncStorage.getItem('user').then(user => {
      if (user === null || user === undefined) {
        this.props.navigation.navigate('UserLogin', { partner: this.partner, image: image })
      } else {
        this.props.dispatch(selectForChat(this.partner, image))
        this.props.navigation.navigate('Chat', { partner: this.partner })
      }
    })
  }

  renderLoading = () => {
    if (this.props.loading)
      return (
        <View>
          <ActivityIndicator animating size="large" />
        </View>
      )
    else
      return null
  }

  renderFeedImage() {
    if (this.props.navigation.state.params.partner !== undefined &&
      typeof this.props.navigation.state.params.partner.feed_image === 'string' &&
      this.props.navigation.state.params.partner.feed_image.length > 0)
      return <ImageZoom
        cropWidth={mainFeedImageWidth}
        cropHeight={mainFeedImageHeight}
        imageWidth={mainFeedImageWidth}
        imageHeight={mainFeedImageHeight}>
        <Image style={styles.mainFeedImage}
          source={{ uri: this.props.navigation.state.params.partner.feed_image }} />
      </ImageZoom>
    else
      return null
  }

  renderItemPost({ item, index }) {
    if (index === 0 && item.feed_image !== undefined) {
      return (this.renderFeedImage())
    } else {
      return (
        <TouchableOpacity onPress={() => this.onClickItemCard(item.image)}>
          <Card styles={styles.card}>
            {item.text !== undefined && item.text !== null &&
              <CardItem >
                <Body>
                  <Text>{item.text}</Text>
                </Body>
              </CardItem>}
            {item.image !== undefined && item.text !== null &&
              <CardItem cardBody style={styles.card}>
                <Image source={{ uri: item.image }} style={styles.image} />
              </CardItem>
            }
          </Card>
        </TouchableOpacity>
      )
    }
  }

  render = () => (
    <ImageBackground style={backgroundImage} source={require('./../static/background.png')} >
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <FlatList
          data={this.props.posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => this.renderItemPost({ item, index })}
          onRefresh={() => { getByPartner(this.partner.id) }}
          refreshing={this.props.loading}
        />
      </View>
    </ImageBackground>
  )
}

PartnerFeedScreen.propTypes = {
  navigation: PropTypes.object,
  dispatch: PropTypes.func
}

const mapStateToProps = (state) => {
  let posts = []
  if (typeof state.posts.partnerSelectedForFeed === 'object' &&
    Object.keys(state.posts.partnerSelectedForFeed).length > 0) {
    if (state.posts.postsByPartner.hasOwnProperty(state.posts.partnerSelectedForFeed.id)) {
      posts = state.posts.postsByPartner[state.posts.partnerSelectedForFeed.id]
    }
  }

  if (posts.length === 0 || posts[0].feed_image === undefined) {
    posts.unshift({
      id: '1',
      feed_image: state.posts.partnerSelectedForFeed.feed_image
    })
  }

  return ({
    loading: state.posts.loading,
    posts: posts
  })
}

export default connect(mapStateToProps)(PartnerFeedScreen)