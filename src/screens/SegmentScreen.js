import React from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
  StatusBar
} from 'react-native'
import { Card, CardItem, Body, H1, H2, H3, Subtitle } from 'native-base'
import Carousel, { ParallaxImage } from 'react-native-snap-carousel'
import { getSegments } from './../actions/segments'
import { getHighlights } from './../actions/highlights'
import { selectForChat } from './../actions/partners'

const horizontalMargin = 15
const slideWidth = 300

const sliderWidth = Dimensions.get('window').width
const itemWidth = slideWidth + horizontalMargin * 2
const itemHeight = 200

const styles = StyleSheet.create({
  slideContainer: {
    paddingTop: 5,
    paddingBottom: 5,
    elevation: 4,
    backgroundColor: '#ffff'
  },
  slide: {
    width: itemWidth,
    height: itemHeight,
    paddingHorizontal: horizontalMargin,
    borderRadius: 50,
  },
  slideSubtitle: {
    backgroundColor: '#1a1919',
    height: 70,
    borderBottomLeftRadius: 5,
    borderBottomRightRadius: 5,
  },
  slideSubtitleText: {
    marginTop: 7,
    marginLeft: 10,
    fontSize: 20,
    color: '#fff',
  },
  slideSubtitleText2: {
    marginTop: 7,
    marginLeft: 10,
    fontSize: 15,
    color: '#fff',
  },
  slideInnerContainer: {
    width: slideWidth,
    flex: 1,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  }
})

class SegmentScreen extends React.PureComponent {
  static navigationOptions = {
    header: null
  }

  componentWillMount() {
    this.props.dispatch(getSegments())
    this.props.dispatch(getHighlights())
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.requestError) {
      Alert.alert('Request Error', nextProps.requestError)
    }
  }

  onPressItem = (item) => {
    this.props.navigation.navigate('Partner', { segment: item })
  }

  keyExtractor = item => item.id.toString()

  renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => this.onPressItem(item)}>
      <View>
        <Card>
          <CardItem>
            <Text>{item.name}</Text>
          </CardItem>
          <CardItem cardBody>
            <Image source={{ uri: item.image.uri }} style={{ height: 100, width: null, flex: 1 }} />
          </CardItem>
        </Card>
      </View>
    </TouchableOpacity>
  )

  renderFooter = (isFatching) => {
    const horizontalMargin = 20
    const slideWidth = 280

    const sliderWidth = Dimensions.get('window').width
    const itemWidth = slideWidth + horizontalMargin * 2
    const itemHeight = 200

    if (!isFatching) return null

    return <ActivityIndicator animating size="large" />
  }

  onPressCarousel = (partner) => {
    this.props.dispatch(selectForChat(partner))
    this.props.navigation.navigate('Chat', { partner })
  }

  renderItemCarousel = ({ item, index }, parallaxProps) => {

    const img = (item.highligh_image !== undefined && item.highligh_image.length !== 0)
      ? item.highligh_image
      : item.logo.uri

    return (
      <TouchableOpacity onPress={() => console.log(this.onPressCarousel(item))}>
        <View style={styles.slide}>
          <ParallaxImage
            source={{ uri: img }}
            containerStyle={styles.slideInnerContainer}
            style={styles.image}
            parallaxFactor={0.4}
            {...parallaxProps}
          />
          <View style={styles.slideSubtitle}>
            <Text style={styles.slideSubtitleText} numberOfLines={2}>
              {item.subtitle}
            </Text>
            <Text style={styles.slideSubtitleText2}>
              {item.highlight_message}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View>
        <View style={styles.slideContainer} >
          <Carousel
            ref={(c) => { this._carousel = c }}
            data={this.props.highlights}
            renderItem={this.renderItemCarousel}
            hasParallaxImages={true}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            autoplay={true}
            loop={true}
          />
        </View>
        <FlatList
          data={this.props.segments}
          keyExtractor={(this.keyExtractor)}
          renderItem={this.renderItem}
          ListFooterComponent={() => this.renderFooter(this.props.isFetching)}
        />
      </View>
    )
  }
}

SegmentScreen.propTypes = {
  navigation: PropTypes.object,
  dispatch: PropTypes.func,
  segments: PropTypes.array,
  isFetching: PropTypes.bool,
  requestError: PropTypes.string,
  highlights: PropTypes.array
}

const mapStateToProps = state => ({
  isFetching: state.segments.isFetching,
  segments: state.segments.data,
  requestError: state.segments.requestError,
  highlights: state.highlights.partners
})

export default connect(mapStateToProps)(SegmentScreen)
