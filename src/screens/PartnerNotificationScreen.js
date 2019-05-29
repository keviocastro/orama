import React from 'react'
import {
  Image,
  Dimensions,
  FlatList,
  StyleSheet,
  ImageBackground,
  Modal,
  View,
  ScrollView,
  TouchableNativeFeedback,
  Linking
} from 'react-native'
import { Card, CardItem, Body } from 'native-base'
import Hyperlink from 'react-native-hyperlink'
import { connect } from 'react-redux'
import { Button, Text } from 'native-base'
import { backgroundImage } from './styles'
import AutoHeightImage from 'react-native-auto-height-image'

const fullWidth = Dimensions.get('window').width

export class PartnerNotificationScreen extends React.Component {
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

  get partner() {
    return this.props.navigation.state.params.partner
  }

  renderItem({ item, index }) {
    return (
      <TouchableNativeFeedback onPress={() => {
        this.setState({
          modalVisible: true,
          modalImage: item.image
        })
      }}>
        <Card styles={styles.card}>
          {item.body !== undefined && item.body !== null > 0 &&
            <CardItem >
              <Body>
                <Hyperlink linkStyle={{ color: '#2980b9' }} onPress={(url, text) => {
                  Linking.openURL(url)
                }}>
                  <Text>{item.body}</Text>
                </Hyperlink>
              </Body>
            </CardItem>}
          {item.image !== undefined && item.text !== null > 0 &&
            <CardItem cardBody style={styles.card}>
              <Image source={{ uri: item.image }} style={{ width: fullWidth, height: 200, resizeMode: 'cover' }} />
            </CardItem>
          }
        </Card>
      </TouchableNativeFeedback>
    )
  }

  render() {
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
          <ImageBackground style={backgroundImage} source={require('./../static/background-modal-images.jpg')} >
            <TouchableNativeFeedback style={{ alignContent: 'flex-start' }} onPress={() => {
              this.setState({
                modalVisible: false
              })
            }}>
              <Image style={{ width: 50, height: 50, marginTop: 10 }} source={require('./../static/icon-back.png')} />
            </TouchableNativeFeedback>
            <ScrollView contentContainerStyle={{ paddingTop: 10 }} >
              <AutoHeightImage source={{ uri: this.state.modalImage }} width={fullWidth} />
            </ScrollView>
          </ImageBackground>
        </Modal>
        <FlatList
          data={this.props.notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => this.renderItem({ item, index })}
          refreshing={this.props.loading} />
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