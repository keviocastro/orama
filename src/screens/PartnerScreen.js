import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  View,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert, Dimensions
} from 'react-native'
import {
  Card,
  CardItem,
  Thumbnail,
  Text,
  Left,
  Body
} from 'native-base'
import Carousel from 'react-native-snap-carousel'
import { getPartners, selectForChat } from '../actions/partners'

const horizontalMargin = 5
const slideWidth = Dimensions.get('window').width - 10

const sliderWidth = Dimensions.get('window').width
const itemWidth = slideWidth + horizontalMargin * 2

const styles = {
  image: {
    height: 200,
    width: null,
    flex: 1,
  },
  emptyState: {
    cardItemImage: {
      justifyContent: 'center'
    },
    cardItemMessages: {
      flexDirection: 'column',
      alignContent: 'center',
      texts: {
        textAlign: 'center'
      }
    },
    cardItemMessagesText: {
      textAlign: 'center'
    }
  },
  chatIcon: {
    fontSize: 37,
  },
}

class PartnerScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.segment.name,
  })

  componentWillMount() {
    this.props.dispatch(getPartners(this.segment.id))
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.requestError) {
      Alert.alert('Request Error', nextProps.requestError)
    }
  }

  onPressPost(partner) {
    this.props.navigation.navigate('PartnerFeed', { partner })
  }

  onPressLogo(partner) {
    this.props.dispatch(selectForChat(partner))
    this.props.navigation.navigate('Chat', { partner })
  }

  get segment() {
    return this.props.navigation.state.params.segment
  }

  keyExtrator = item => item.id.toString()

  renderCardItemBodyImage = (partner, imageUri) => {
    console.log("imageUri: ", imageUri)
    return (
      <View>
        <TouchableOpacity onPress={() => this.onPressPost(partner)}>
          <CardItem cardBody>
            <Image source={{ uri: imageUri }} style={styles.image} />
          </CardItem>
        </TouchableOpacity>
      </View>
    )
  }

  renderCardItemBodyCoursel = (partner) => (
    <Carousel
      ref={(c) => { this._carousel = c }}
      data={partner.latest_posts}
      renderItem={(item) => {
        return this.renderCardItemBodyImage(partner, item.item.image)
      }}
      sliderWidth={sliderWidth}
      itemWidth={itemWidth}
      autoplay={false}
      loop={false}
    />
  )

  renderCardItemBody = (partner) => {
    if (!Object.prototype.hasOwnProperty.call(partner, 'latest_posts')) return null

    if (partner.latest_posts.length === 1) return this.renderCardItemBodyImage(partner, partner.latest_posts[0].image)

    if (partner.latest_posts.length > 1) return this.renderCardItemBodyCoursel(partner)
  }

  renderItem = ({ item }) => (
    <Card>
      <TouchableOpacity onPress={() => this.onPressLogo(item)}>
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
  )

  renderFooter = () => {
    if (!this.props.isFetching) return null

    return (
      <View>
        <ActivityIndicator animating size="large" />
      </View>
    )
  }

  renderEmptyState = () => (
    <Card>
      <CardItem cardBody style={styles.emptyState.cardItemImage}>
        <Image source={require('./../static/empty-state.png')} />
      </CardItem>
      <CardItem style={styles.emptyState.cardItemMessages}>
        <Text style={styles.emptyState.cardItemMessages.texts}>
          Esta categoria ainda está sem parceiros.
        </Text>
        <Text style={styles.emptyState.cardItemMessages.texts}>
          Estamos correndo para inclui-los.
        </Text>
        <Text style={styles.emptyState.cardItemMessages.texts}>
          Em breve teremos várias empresas no segmento de {this.segment.name}.
        </Text>
      </CardItem>
    </Card>
  )

  render() {
    if (this.props.partners.length <= 0 && this.props.isFetching === false) {
      return this.renderEmptyState()
    }

    return (
      <FlatList
        data={this.props.partners}
        keyExtractor={this.keyExtrator}
        renderItem={this.renderItem}
        ListFooterComponent={this.renderFooter}
      />
    )
  }
}

PartnerScreen.propTypes = {
  navigation: PropTypes.object,
  dispatch: PropTypes.func,
  partners: PropTypes.array,
  isFetching: PropTypes.bool,
  requestError: PropTypes.string,
}

const mapStateToProps = (state) => {
  let props = {}
  const segmentId = state.partners.currentSegmentId

  const hasPartnersBySegment = Object.prototype.hasOwnProperty.call(
    state.partners.bySegment,
    segmentId,
  )

  props = hasPartnersBySegment
    ? {
      isFetching: state.partners.bySegment[segmentId].isFetching,
      partners: state.partners.bySegment[segmentId].data,
      requestError: state.partners.bySegment[segmentId].requestError,
      openChatModal: state.partners.openChatModal,
    }
    : {
      isFetching: true,
      partners: [],
      requestError: '',
      openChatModal: false,
    }

  return props
}

export default connect(mapStateToProps)(PartnerScreen)
