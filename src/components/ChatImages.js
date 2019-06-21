import React, { Component } from 'react'
import { View, TouchableOpacity, FlatList, Image, Modal, Dimensions, ImageBackground, ScrollView, TouchableNativeFeedback } from 'react-native'
import PhotoView from 'react-native-photo-view'
import PropTypes from 'prop-types'
import md5 from 'md5'
import { backgroundImage } from './../screens/styles'

const fullWidth = Dimensions.get('window').width
const fullHeight = Dimensions.get('window').height

export default class ChatImages extends Component {

  constructor(props) {
    super(props)

    this.state = {
      modalVisible: false,
      modalImage: null
    }
  }

  renderImage(image) {
    return <TouchableOpacity onPress={() => {
      Image.getSize(image, (width, height) => {
        this.setState({
          modalVisible: true,
          modalImage: image,
          modalImagemHeight: (fullWidth / width) * height
        })
      })
    }}>
      <Image style={{
        height: 100,
        width: 200,
        resizeMode: 'cover'
      }} source={{ uri: image }} />
    </TouchableOpacity>
  }

  render() {
    if (this.props.images && this.props.images.length > 0) {
      return <View style={{ height: 100 }}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({
              modalVisible: false
            })
          }}>
          <ImageBackground source={require('./../static/background-modal-images.jpg')} style={backgroundImage}>
            <View style={{
              flex: 1,
              flexDirection: 'row',
              justifyContent: 'space-between',
              width: fullWidth
            }}>
              <TouchableNativeFeedback onPress={() => {
                this.setState({
                  modalVisible: false
                })
              }}>
                <Image style={{ width: 50, height: 50, marginLeft: 10, backgroundColor: 'transparent', zIndex: 999 }} source={require('./../static/icon-back.png')} />
              </TouchableNativeFeedback>
              {this.props.onRemove &&
                <TouchableNativeFeedback onPress={() => {
                  this.setState({
                    modalVisible: false
                  })
                  this.props.onRemove(this.state.modalImage)
                }}>
                  <Image style={{ height: 30, width: 30, marginRight: 10, marginTop: 10, backgroundColor: 'transparent', zIndex: 999 }} source={require('./../static/icon-remove.png')} />
                </TouchableNativeFeedback>
              }
            </View>
            <ScrollView bouncesZoom={true} minimumZoomScale={1} maximumZoomScale={5} >
              <View style={{ minHeight: fullHeight, justifyContent: 'center', alignItems: 'center' }}>
                <PhotoView
                  source={{ uri: this.state.modalImage }}
                  minimumZoomScale={1}
                  maximumZoomScale={3}
                  androidScaleType="fitXY"
                  style={{ width: fullWidth, height: this.state.modalImagemHeight }} />
              </View>
            </ScrollView>
          </ImageBackground>
        </Modal>
        <FlatList
          horizontal={true}
          data={this.props.images}
          keyExtractor={(image) => md5(image)}
          renderItem={({ item }) => this.renderImage(item)}
        />
      </View >
    } else {
      return null
    }
  }
}

ChatImages.propTypes = {
  images: PropTypes.array,
  removeAcion: PropTypes.func
}