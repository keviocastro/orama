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
import LinearGradient from 'react-native-linear-gradient'
import Carousel from 'react-native-snap-carousel'
import SplashScreen from 'react-native-splash-screen'
import { getSegments } from './../actions/segments'
import { getHighlights } from './../actions/highlights'
import { selectForChat } from './../actions/partners'

const horizontalMargin = 0
const slideWidth = 300

const sliderWidth = Dimensions.get('window').width
const itemWidth = slideWidth + horizontalMargin * 2
const itemHeight = 100

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

  onPressSegment = (segment) => {
    if (segment.id === 17) {
      this.props.navigation.navigate('Login', { segment: segment })
    } else {
      this.props.navigation.navigate('Partner', { segment: segment })
    }
  }

  keyExtractor = item => item.id.toString()

  renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => this.onPressSegment(item)}>
      <View>
        <Card>
          <CardItem>
            <Text>{item.name}</Text>
          </CardItem>
          <CardItem cardBody>
            <Image source={{ uri: item.image }} style={styles.segmentImage} />
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
      <TouchableOpacity onPress={() => this.onPressCarousel(item)}>
        <View style={styles.slide}>
          <View style={styles.slideInnerContainer}>
            <Image source={{ uri: img }} style={styles.slideImage} />
          </View>
        </View>
      </TouchableOpacity>
    )
  }

  render() {
    return (
      <View style={styles.viewContainer}>
        <LinearGradient
          colors={['#008cff', '#ffffff']}
          style={styles.slideContainer}
        >
          <Carousel
            ref={(c) => { this._carousel = c }}
            data={this.props.highlights}
            renderItem={this.renderItemCarousel}
            sliderWidth={sliderWidth}
            itemWidth={itemWidth}
            autoplay={true}
            autoplayDelay={3000}
            autoplayInterval={3000}
            loop={true}
            loopClonesPerSide={3}
            firstItem={1}
            enableMomentum={true}
            enableSnap={true}
          />
        </LinearGradient>
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

const styles = StyleSheet.create({
  viewContainer: {
    flex: 1,
  },
  slideContainer: {
    paddingTop: 5,
    elevation: 4,
    backgroundColor: '#ffff',
    height: 112
  },
  slide: {
    width: itemWidth,
    height: itemHeight,
    paddingHorizontal: horizontalMargin,
  },
  slideSubtitle: {
    height: 25,
    backgroundColor: '#1a1919',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  slideSubtitleText: {
    marginTop: 2,
    marginLeft: 10,
    fontSize: 14,
    color: '#fff',
    alignSelf: 'center',
  },
  slideInnerContainer: {
    width: slideWidth,
    flex: 1,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  slideImage: {
    width: slideWidth,
    height: '100%',
    borderRadius: 10,
  },
  segmentImage: {
    height: 100,
    width: null,
    flex: 1
  }
})

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
