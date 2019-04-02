import { Dimensions } from 'react-native'

export const backgroundImage = {
  resizeMode: 'center',
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
}

var { width } = Dimensions.get('window').width
let imageHeight = Math.round((width * 9) / 16)
export const responsiveImageFullScreen = {
  width,
  height: imageHeight
}