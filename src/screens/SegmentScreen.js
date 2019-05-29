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
import { selectPartnerChat, } from './../actions/partnerChatMessages'
import { sendMessages, addNotificationMessage } from './../actions/chat'
import firebase from 'react-native-firebase'
const firestore = firebase.firestore()

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
    this.receiveNotifications()
    this.reveiveMessages()

    if (this.props.segments.length === 0 && this.props.loading === false) {
      this.props.dispatch(getSegments())
      this.props.dispatch(getHighlights())
    }

    // Notify Test
    // this.displayNotification({
    //   data: {
    //     image: "https://firebasestorage.googleapis.com/v0/b/o-rama2.appspot.com/o/notifications-image-GThLMIMQlZG1yYLP49WQ.jpeg?alt=media",
    //     notification_id: "GThLMIMQlZG1yYLP49WQ",
    //     partner_id: "Ka8a1fwbIkapLDwhdFxh",
    //     title: "Teste",
    //     body: "Teste local"
    //   }
    // });
  }

  reveiveMessages() {
    this.messageListener = firebase.messaging().onMessage((message) => {
      this.displayNotification(message)
    });
  }

  receiveNotifications() {
    firebase.messaging().subscribeToTopic('orama');
    firebase.messaging().hasPermission()
      .then(enabled => {
        if (!enabled) {
          firebase.messaging().requestPermission()
            .then(() => {
              // autorization
            })
            .catch(error => {
              // User has rejected permissions
            })
        }
      })

    this.notificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification) => {
      // IOS
    });

    this.notificationListener = firebase.notifications().onNotification((notify) => {
      this.displayNotification(notify)
    });

    this.notificationOpenedListener = firebase.notifications()
      .onNotificationOpened((notify) => {
        this.onNotificationOpened(notify)
      });

    firebase.notifications()
      .getInitialNotification()
      .then((notify) => {
        this.onNotificationOpened(notify)
      });

  }

  onNotificationOpened(notificationOpen) {
    if (notificationOpen) {
      const action = notificationOpen.action;
      const notification = notificationOpen.notification;

      if (notification.data.type && notification.data.type === 'chat') {
        firestore
          .collection('chats')
          .doc(notification.data.chat_id)
          .get()
          .then(snapshot => {

            let chat = snapshot.data()
            chat.id = snapshot.id

            if (notification.data.send_by === 'user') {

              this.props.dispatch(selectPartnerChat(chat))
              this.props.navigation.navigate('PartnerChatMessage', { chat: chat })
              this.closeNotification(notification)
            }

            if (notification.data.send_by === 'partner') {
              firestore
                .collection('partners')
                .doc(chat.partner_id)
                .get()
                .then(snapshot => {
                  let partner = snapshot.data()
                  partner.id = snapshot.id
                  this.navigateToChat(partner)
                  this.closeNotification(notification)
                })
            }

          })

      } else {

        firestore
          .collection('partners')
          .doc(notification.data.partner_id)
          .get()
          .then(snapshot => {
            let partner = snapshot.data()
            partner.id = snapshot.id

            this.navigateToChat(partner, notification.data.image, notification)
            this.closeNotification(notification)
          })
      }

    }
  }

  closeNotification(notification) {
    firebase.notifications().removeDeliveredNotification(notification.notificationId);
  }

  displayNotification(message) {
    let notify = true

    // Não notificar se o usuário estiver na tela de chat com parceiro
    if (message.data.send_by === "partner" &&
      this.props.currentRoute.routeName === "Chat" &&
      this.props.currentRoute.params &&
      this.props.currentRoute.params.partner &&
      this.props.currentRoute.params.partner.id === message.data.partner_id) {
      notify = false
    }

    // Não notificar se o parceiro estiver na tela de chat com cliente
    if (message.data.send_by === "user" &&
      this.props.currentRoute.routeName === "PartnerChatMessage" &&
      this.props.currentRoute.params &&
      this.props.currentRoute.params.chat &&
      this.props.currentRoute.params.chat.user_id === message.data.user_id) {
      notify = false
    }

    if (notify) {
      let notification = new firebase.notifications.Notification();
      notification = notification.setTitle(message.data.title).setBody(message.data.body).setData(message.data)

      notification.android.setPriority(firebase.notifications.Android.Priority.High)
      notification.android.setChannelId('orama')
      notification.android.setLargeIcon('ic_launcher')
      notification.android.setSmallIcon('icon')

      if (message.data.image) {
        notification.android.setBigPicture(message.data.image, 'ic_launcher', message.data.title, message.data.body)
      }

      firebase.notifications().displayNotification(notification)
    }
  }

  componentWillUnmount() {
    this.notificationDisplayedListener();
    this.notificationListener();
    this.notificationOpenedListener();
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

  navigateToChat(partner, image, notification) {
    this.props.dispatch(selectForChat(partner, image))
    if (this.props.loggedUser) {
      if (notification) {
        this.props.dispatch(addNotificationMessage(notification))
      }
      this.props.navigation.navigate('Chat', { partner, image })
    } else {
      this.props.navigation.navigate('UserLogin', { partner: partner, image, goBack: 'Home' })
    }
  }

  onPressCarousel = (partner) => {
    this.navigateToChat(partner)
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
            autoplayDelay={1000}
            autoplayInterval={2000}
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
  let currentRoute = undefined
  state.nav.routes.forEach((route, indexRoute) => {
    route.routes.forEach((subRoute, indexSubroute) => {
      if (route.index === indexSubroute)
        currentRoute = subRoute
    })
  })

  return ({
    loading: state.segments.loading,
    segments: state.segments.segments,
    highlights: state.highlights.partners,
    loggedPartner: state.auth.partner,
    loggedUser: state.auth.user,
    currentRoute: currentRoute
  })
}

export default connect(mapStateToProps)(SegmentScreen)