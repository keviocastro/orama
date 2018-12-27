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
  Dimensions
} from 'react-native'
import { Card, CardItem } from 'native-base'
import Carousel, { ParallaxImage } from 'react-native-snap-carousel'
import SplashScreen from 'react-native-splash-screen'
import { getSegments } from './../actions/segments'
import { getHighlights } from './../actions/highlights'
import { selectForChat } from './../actions/partners'

const horizontalMargin = 3
const slideWidth = 300

const sliderWidth = Dimensions.get('window').width
const itemWidth = slideWidth + horizontalMargin * 2
const itemHeight = 152

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
  },
  slideContainer: {
    paddingTop: 5,
    elevation: 4,
    backgroundColor: '#ffff',
    height: 172
  },
  slide: {
    width: itemWidth,
    height: itemHeight,
    paddingHorizontal: horizontalMargin,
    borderRadius: 70,
  },
  slideSubtitle: {
    backgroundColor: '#1a1919',
    height: 50,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10
  },
  slideSubtitleText: {
    marginTop: 2,
    marginLeft: 10,
    fontSize: 17,
    color: '#fff',
  },
  slideSubtitleText2: {
    marginTop: 2,
    marginLeft: 10,
    fontSize: 11,
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

  componentDidMount() {
    SplashScreen.hide()
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
            <Image source={{ uri: item.image }} style={{ height: 100, width: null, flex: 1 }} />
          </CardItem>
        </Card>
      </View>
    </TouchableOpacity>
  )

  renderFooter = (isFetching) => {
    if (!isFetching) return null

    return <ActivityIndicator animating size="large" />
  }

  onPressCarousel = (partner) => {
    this.props.dispatch(selectForChat(partner))
    this.props.navigation.navigate('Chat', { partner })
  }

  renderItemCarousel = ({ item, index }, parallaxProps) => {

    const img = (item.highligh_image !== undefined && item.highligh_image.length !== 0)
      ? item.highligh_image
      : item.logo

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
      <View style={styles.viewContainer}>
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
          style={styles.list}
          data={this.props.segments}
          keyExtractor={(this.keyExtractor)}
          renderItem={this.renderItem}
          onRefresh={() => this.props.dispatch(getSegments())}
          refreshing={this.props.isFetching}
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
