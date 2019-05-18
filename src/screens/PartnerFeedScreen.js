import React from 'react'
import {
  FlatList,
  Text,
  ActivityIndicator,
  View,
  Image,
  StyleSheet,
  TouchableNativeFeedback,
  Dimensions,
  ImageBackground,
  AsyncStorage,
  Modal,
  ScrollView
} from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Card, CardItem, Body } from 'native-base'
import { selectForChat } from './../actions/partners'
import { Header } from 'react-navigation'
import { getRealtimeByPartner, getByPartner } from './../actions/posts'
import { backgroundImage } from './styles'
import AutoHeightImage from 'react-native-auto-height-image'

const viewportHeight = Dimensions.get('window').height - Header.HEIGHT
const mainFeedImageHeight = viewportHeight - (viewportHeight * 0.7)
const mainFeedImageWidth = Dimensions.get('window').width
const fullWidth = Dimensions.get('window').width

const modalImagemHeight = viewportHeight - (viewportHeight * 0.1)
const modalImageWidth = Dimensions.get('window').width

const styles = StyleSheet.create({
  card: { paddingBottom: 2, paddingBottom: 2 },
  image: {
    width: fullWidth,
    height: null,
    flex: 1,
    resizeMode: 'contain'
  },
  mainFeedImage: {
    flex: 1,
    resizeMode: 'cover',
    height: mainFeedImageHeight
  }
})

class PartnerFeedScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.partner.name
  })

  constructor(props) {
    super(props)

    this.state = {
      modalVisible: false,
      modalImage: null
    }
  }
  componentDidMount() {
    if (this.props.posts.length <= 1) {
      this.props.dispatch(getRealtimeByPartner(this.partner.id))
    }
  }

  get partner() {
    return this.props.navigation.state.params.partner
  }

  onClickItemCard = (image) => {
    AsyncStorage.getItem('user').then(user => {
      if (user === null || user === undefined) {
        this.props.navigation.navigate('UserLogin', { partner: this.partner, image: image, goBack: 'PartnerFeed' })
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

  renderFeedImage(image) {
    return <TouchableNativeFeedback onPress={() => {
      this.setState({
        modalVisible: true,
        modalImage: image
      })
    }}>
      <Image style={{ ...styles.mainFeedImage, marginTop: 5 }} source={{ uri: image }} />
    </TouchableNativeFeedback>
  }

  renderItemPost({ item, index }) {
    if (item.id === '1' && item.feed_image !== undefined) {
      return (this.renderFeedImage(item.feed_image))
    } else {
      return (
        <TouchableNativeFeedback onPress={() => this.onClickItemCard(item.image)}>
          <Card styles={styles.card}>
            {item.text !== undefined && item.text !== null &&
              <CardItem >
                <Body>
                  <Text>{item.text}</Text>
                </Body>
              </CardItem>}
            {item.image !== undefined && item.text !== null &&
              <CardItem cardBody style={styles.card}>
                <Image source={{ uri: item.image }} style={{ width: fullWidth, height: 200, resizeMode: 'cover' }} />
              </CardItem>
            }
          </Card>
        </TouchableNativeFeedback>
      )
    }
  }

  render = () => (
    <ImageBackground style={backgroundImage} source={require('./../static/background.png')} >
      <Modal
        animationType="slide"
        transparent={false}
        visible={this.state.modalVisible}
        onRequestClose={() => {
          this.setState({
            modalVisible: false
          })
        }}>
        <ImageBackground style={backgroundImage} source={require('./../static/background-modal-images.jpg')} >
          <TouchableNativeFeedback onPress={() => {
            this.setState({
              modalVisible: false
            })
          }}>
            <View style={{ flex: 1, alignContent: 'flex-start', alignItems: 'flex-start' }}>
              <Image style={{ width: 50, height: 50 }} source={require('./../static/icon-back.png')} />
            </View>
          </TouchableNativeFeedback>
          <ScrollView bouncesZoom={true} >
            <AutoHeightImage source={{ uri: this.state.modalImage }} width={fullWidth} />
          </ScrollView>
        </ImageBackground>
      </Modal>
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
    posts: posts,
    user: state.auth.user
  })
}

export default connect(mapStateToProps)(PartnerFeedScreen)