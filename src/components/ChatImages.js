import React, { Component } from 'react'
import { View, TouchableOpacity, FlatList, Image, Modal, Dimensions, ImageBackground } from 'react-native'
import ImageZoom from 'react-native-image-pan-zoom'
import AutoHeightImage from 'react-native-auto-height-image'
import PropTypes from 'prop-types'
import md5 from 'md5'

const viewportHeight = Dimensions.get('window').height
const modalImagemHeight = viewportHeight - (viewportHeight * 0.25)
const modalImageWidth = Dimensions.get('window').width

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
      this.setState({
        modalVisible: true,
        modalImage: image
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
          <ImageBackground source={require('./../static/background-modal-images.jpg')} style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            {this.props.onRemove &&
              <TouchableOpacity onPress={() => {
                this.setState({
                  modalVisible: false
                })
                this.props.onRemove(this.state.modalImage)
              }}>
                <Image style={{ height: 30, width: 30, marginBottom: 10, backgroundColor: 'transparent' }} source={require('./../static/icon-remove.png')} />

              </TouchableOpacity>
            }
            <ImageZoom
              cropWidth={modalImageWidth}
              cropHeight={modalImagemHeight}
              imageWidth={modalImageWidth}
              imageHeight={modalImagemHeight} >
              <AutoHeightImage width={modalImageWidth} source={{ uri: this.state.modalImage }} />
            </ImageZoom>
            <TouchableOpacity onPress={() => {
              this.setState({
                modalVisible: false
              })
            }}>
              <Image style={{ width: 50, height: 50, marginTop: 10 }} source={require('./../static/icon-down.png')} />
            </TouchableOpacity>
          </ImageBackground>
        </Modal>
        <FlatList
          horizontal={true}
          data={this.props.images}
          keyExtractor={(image) => md5(image)}
          renderItem={({ item }) => this.renderImage(item)}
        />
      </View>
    } else {
      return null
    }
  }
}

ChatImages.propTypes = {
  images: PropTypes.array,
  removeAcion: PropTypes.func
}