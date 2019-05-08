import React from 'react'
import {
  Image,
  Dimensions,
  FlatList,
  StyleSheet,
  ImageBackground,
  Modal,
  View,
  TouchableOpacity
} from 'react-native'
import ImageZoom from 'react-native-image-pan-zoom'
import { Card, CardItem, Body } from 'native-base'
import { connect } from 'react-redux'
import { Button, Text } from 'native-base'
import { backgroundImage } from './styles'
import { getNotificationsRealtime } from './../actions/notifications'
import AutoHeightImage from 'react-native-auto-height-image'

const fullWidth = Dimensions.get('window').width
const viewportHeight = Dimensions.get('window').height
const modalImagemHeight = viewportHeight - (viewportHeight * 0.25)
const modalImageWidth = Dimensions.get('window').width

export class PartnerNotificationScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => ({
    title: ' Minhas notificações'
  })

  constructor(props) {
    super(props)

    this.state = {
      modalVisible: false,
      modalImage: null
    }
  }

  componentDidMount() {
    if (this.props.notifications.length === 0) {
      this.props.dispatch(getNotificationsRealtime(this.partner))
    }
  }


  get partner() {
    return this.props.navigation.state.params.partner
  }

  renderItem({ item, index }) {
    return (
      <TouchableOpacity onPress={() => {
        this.setState({
          modalVisible: true,
          modalImage: item.image
        })
      }}>
        <Card styles={styles.card}>
          {item.title !== undefined && item.title !== null > 0 &&
            <CardItem >
              <Body>
                <Text>{item.title}</Text>
              </Body>
            </CardItem>}
          {item.image !== undefined && item.text !== null > 0 &&
            <CardItem cardBody style={styles.card}>
              <AutoHeightImage source={{ uri: item.image }} width={fullWidth} />
            </CardItem>
          }
        </Card>
      </TouchableOpacity>
    )
  }

  render() {
    const { notifications, loading } = this.props
    return (
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
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "black" }}>
            <ImageZoom
              cropWidth={modalImageWidth}
              cropHeight={modalImagemHeight}
              imageWidth={modalImageWidth}
              imageHeight={modalImagemHeight} >
              <AutoHeightImage source={{ uri: this.state.modalImage }} width={fullWidth} />
            </ImageZoom>
            <TouchableOpacity onPress={() => {
              this.setState({
                modalVisible: false
              })
            }}>
              <Image style={{ width: 50, height: 50, marginTop: 10, backgroundColor: 'black' }} source={require('./../static/icon-down.png')} />
            </TouchableOpacity>
          </View>
        </Modal>
        {!loading &&
          <Button style={{ width: fullWidth, justifyContent: 'center', marginTop: 10, marginBottom: 10 }}
            info
            onPress={() => { this.props.navigation.navigate('Post', { partner: this.partner, title: 'Envio de notificação', notify: true }) }}>
            <Text>Enviar notificação</Text>
          </Button>}
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => this.renderItem({ item, index })}
          onRefresh={() => { alert('get notifications') }}
          refreshing={loading} />
      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  card: { paddingBottom: 2, paddingBottom: 2 },
  image: {
    height: 350,
    width: fullWidth,
    flex: 1,
    resizeMode: 'cover'
  }
})

const mapStateToProps = (state) => {
  return ({
    loading: state.notifications.loading,
    notifications: state.notifications.notifications
  })
}

export default connect(mapStateToProps)(PartnerNotificationScreen)