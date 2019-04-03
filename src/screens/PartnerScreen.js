import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import {
  View,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Dimensions,
  ImageBackground
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
import { getPartners } from '../actions/partners'
import { selectedPartnerForFeed } from '../actions/posts'
import { backgroundImage } from './styles';

const horizontalMargin = 5
const slideWidth = Dimensions.get('window').width - 10

const sliderWidth = Dimensions.get('window').width
const itemWidth = slideWidth + horizontalMargin * 2

class PartnerScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.segment.name,
  })

  refrash() {
    this.props.dispatch(getPartners(this.segment.id))
  }

  componentDidMount() {
    this.props.dispatch(getPartners(this.segment.id))
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.requestError) {
      Alert.alert('Request Error', nextProps.requestError)
    }
  }

  navigationForFeed(partner) {
    this.props.dispatch(selectedPartnerForFeed(partner))
    this.props.navigation.navigate('PartnerFeed', { partner })
  }

  onPressPost(partner) {
    this.navigationForFeed(partner)
  }

  onPressLogo(partner) {
    this.navigationForFeed(partner)
  }

  get segment() {
    return this.props.navigation.state.params.segment
  }

  keyExtrator = item => item.id.toString()

  renderCardItemBodyImage = (partner, imageUri) => {
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
      renderItem={(image) => {
        return this.renderCardItemBodyImage(partner, image.item)
      }}
      sliderWidth={sliderWidth}
      itemWidth={itemWidth}
      autoplay={false}
      loop={true}
    />
  )

  renderCardItemBody = (partner) => {
    if (typeof partner.last_post === 'string') {
      return this.renderCardItemBodyImage(partner, partner.last_post)
    } else {
      return null
    }
  }

  renderItem = ({ item }) => (
    <Card>
      <TouchableOpacity onPress={() => this.onPressLogo(item)}>
        <CardItem>
          <Left>
            <Thumbnail source={{ uri: item.logo }} />
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
    <ImageBackground style={styles.emptyState.background} source={require('./../static/background.png')} >
      <View style={styles.emptyState.containerMessages}>
        <Text style={styles.emptyState.containerMessages.text}>
          Esta categoria ainda está sem parceiros.
        </Text>
        <Text style={styles.emptyState.containerMessages.text}>
          Estamos correndo para inclui-los.
        </Text>
        <Text style={styles.emptyState.containerMessages.text}>
          Em breve teremos várias empresas no segmento de {this.segment.name}.
        </Text>
      </View>
    </ImageBackground >
  )

  render() {
    if (this.props.partners.length <= 0 && this.props.isFetching === false) {
      return this.renderEmptyState()
    }

    return (
      <ImageBackground style={backgroundImage} source={require('./../static/background.png')} >
        <FlatList
          onRefresh={() => this.refrash()}
          refreshing={this.props.isFetching}
          data={this.props.partners}
          keyExtractor={this.keyExtrator}
          renderItem={this.renderItem}
        />
      </ImageBackground>
    )
  }
}

const styles = {
  image: {
    height: 200,
    width: null,
    flex: 1,
  },
  emptyState: {
    background: {
      resizeMode: 'stretch',
      height: '100%',
      width: '100%',
      flex: 1,
      justifyContent: 'center',
    },
    containerMessages: {
      flexDirection: 'column',
      alignContent: 'center',
      paddingLeft: 15,
      paddingRight: 15,
      text: {
        textAlign: 'center'
      },
      paddingBottom: 50,
    },
    cardItemMessagesText: {
      textAlign: 'center'
    }
  },
  chatIcon: {
    fontSize: 37,
  },
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
