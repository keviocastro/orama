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
  StyleSheet,
  Dimensions,
  TextInput,
  AsyncStorage
} from 'react-native'
import { Card, CardItem } from 'native-base'
import LinearGradient from 'react-native-linear-gradient'
import Carousel from 'react-native-snap-carousel'
import SplashScreen from 'react-native-splash-screen'
import { getSegments } from './../actions/segments'
import { getHighlights } from './../actions/highlights'
import { selectForChat, searchPartners } from './../actions/partners'
import PushNotificationAndroid from 'react-native-push-notification'

const horizontalMargin = 0
const slideWidth = 300

const sliderWidth = Dimensions.get('window').width
const itemWidth = slideWidth + horizontalMargin * 2
const itemHeight = 100

const fullWidth = Dimensions.get('window').width - 20

class SegmentScreen extends React.Component {
  static navigationOptions = {
    header: null
  }

  componentDidMount() {
    SplashScreen.hide()

    if (this.props.segments.length === 0 && this.props.loading === false) {
      this.props.dispatch(getSegments())
      this.props.dispatch(getHighlights())
    }

    AsyncStorage.getItem('partnerNotification').then(partner => {
      if (partner) {
        partner = JSON.parse(partner)
        this.props.dispatch(selectedPartnerForFeed(partner))
        this.props.navigation.navigate('PartnerFeed', { partner })
        AsyncStorage.removeItem('partnerNotification')
      }
    })

  }

  onPressSegment = (segment) => {
    if (segment.id === 0) {
      if (this.props.loggedPartner == null) {
        this.props.navigation.navigate('Login')
      } else {
        this.props.navigation.navigate('PartnerAccount', { partner: this.props.loggedPartner })
      }
    } else {
      this.props.navigation.navigate('Partner', { segment: segment })
    }
  }

  keyExtractor = item => item.id.toString()

  renderItem = ({ item }) => {
    return (<TouchableOpacity onPress={() => this.onPressSegment(item)}>
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
    </TouchableOpacity>)

  }

  renderFooter = (loading) => {
    if (!loading) return null

    return <ActivityIndicator animating size="large" />
  }

  onPressCarousel = (partner) => {
    this.props.dispatch(selectForChat(partner))
    if (this.props.loggedUser) {
      this.props.navigation.navigate('Chat', { partner })
    } else {
      this.props.navigation.navigate('UserLogin', { partner: partner, goBack: 'Home' })
    }
  }

  renderItemCarousel = ({ item }) => {

    const img = (item.highlight_image !== undefined && item.highlight_image.length !== 0)
      ? item.highlight_image
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

  onSearchPartners() {
    this.props.navigation.navigate('PartnerSearch', { search: this.inputSearch.value })
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
            loop={true}
            enableSnap={true}
            loopClonesPerSide={3}
          />
        </LinearGradient>
        <TextInput
          ref={input => { this.inputSearch = input }}
          clearButtonMode='always'
          placeholder='Pesquisa de empresas'
          clearTextOnFocus={true}
          autoFocus={false}
          onFocus={() => this.onSearchPartners()}
          label="Pesquisa de empresas"
          onSubmitEditing={() => { this.onSearchPartners() }}
          style={{
            height: 40,
            width: fullWidth,
            borderColor: 'gray',
            marginLeft: 10,
            borderWidth: 1,
            marginTop: 10,
            marginBottom: 5
          }}
          onChangeText={(text) => {
            this.inputSearch.value = text
          }}
        />
        <FlatList
          style={styles.list}
          data={this.props.segments}
          keyExtractor={(this.keyExtractor)}
          renderItem={({ item }) => this.renderItem({ item })}
          onRefresh={() => {
            this.props.dispatch(getSegments())
            this.props.dispatch(getHighlights())
          }}
          refreshing={this.props.loading}
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
  loading: PropTypes.bool,
  highlights: PropTypes.array
}

const mapStateToProps = state => {
  return ({
    loading: state.segments.loading,
    segments: state.segments.segments,
    highlights: state.highlights.partners,
    loggedPartner: state.auth.partner,
    loggedUser: state.auth.user
  })
}

export default connect(mapStateToProps)(SegmentScreen)