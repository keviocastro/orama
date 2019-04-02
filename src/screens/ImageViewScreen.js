import React from 'react'
import { Image, Dimensions, View } from 'react-native'
import { connect } from 'react-redux'
import ImageZoom from 'react-native-image-pan-zoom'

class ImageViewScreen extends React.Component {

  get image() {
    return this.props.navigation.state.params.image
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "black" }}>
        <ImageZoom
          cropWidth={modalImageWidth}
          cropHeight={modalImagemHeight}
          imageWidth={modalImageWidth}
          imageHeight={modalImagemHeight} >
          <Image style={{ width: modalImageWidth, height: modalImagemHeight, resizeMode: "stretch" }}
            source={{ uri: this.image }}
          />
        </ImageZoom>
      </View>
    )
  }
}

const viewportHeight = Dimensions.get('window').height
const modalImagemHeight = viewportHeight - (viewportHeight * 0.25)
const modalImageWidth = Dimensions.get('window').width

export default connect()(ImageViewScreen)