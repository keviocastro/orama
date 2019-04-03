import React from 'react'
import {
  View,
  TextInput,
  Dimensions,
  ActivityIndicator,
  Image,
  ImageBackground
} from 'react-native'
import { Button, Text } from 'native-base'
import { connect } from 'react-redux'
import PhotoUpload from 'react-native-photo-upload'
import { sendPost, updateLatestPosts } from './../actions/posts'
import { getPartners } from './../actions/partners';
import { backgroundImage } from './styles'

// FIXME: Remover dependencia imagepicker

const fullWidth = Dimensions.get('window').width - 20

const options = {
  title: 'Foto do seu novo post',
  takePhotoButtonTitle: 'Tire uma foto',
  chooseFromLibraryButtonTitle: 'Ou escolha da galeria',
  storageOptions: {
    skipBackup: true,
    path: 'o-rama',
  },
};

class PostScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Nova postagem'
  })

  get partner() {
    return this.props.navigation.state.params.partner
  }

  componentWillReceiveProps(props) {
    if (props.postCreated) {
      this.props.dispatch(updateLatestPosts(this.partner.id, this.state.image))
      this.inputText.clear()
      this.setState({
        image: null
      })
      this.props.navigation.goBack()
    }
  }

  onPressSendPost() {
    this.props.dispatch(sendPost(this.inputText.value, this.state.image, this.partner.id))
    if (typeof this.partner.segmentIds === 'array') {
      this.partner.segmentIds.forEach(segmentId => {
        this.props.dispatch(getPartners(segmentId))
      })
    }
  }

  render() {
    return <ImageBackground style={backgroundImage} source={require('./../static/background.png')} >
      <View style={{ flexDirerection: 'column', justifyContent: 'center', alignItens: 'center', marginTop: 20 }} >
        <TextInput
          ref={input => { this.inputText = input }}
          clearButtonMode='always'
          placeholder='Texto do post'
          clearTextOnFocus={true}
          autoFocus={false}
          label="Texto do post"
          style={{ height: 40, width: fullWidth, borderColor: 'gray', marginLeft: 10, borderWidth: 1, marginTop: 2 }}
          onChangeText={(text) => {
            this.inputText.value = text
          }}
          multiline={true}
          numberOfLines={2}
        />
        <View style={{
          height: 200,
          marginTop: 10
        }}>
          <PhotoUpload
            onPhotoSelect={image => {
              if (image) {
                this.setState({
                  image: 'data:image/jpeg;base64,' + image
                })
              }
            }}>
            <Image
              style={{ height: 200, width: 400, flex: 1, resizeMode: 'center' }}
              resizeMode='cover'
              source={require('./../static/upload-image.png')}
            />
          </PhotoUpload>
        </View>
        {!this.props.sending &&
          <Button style={{ width: fullWidth, justifyContent: 'center', marginLeft: 10, marginTop: 40, marginBottom: 40 }}
            info
            onPress={() => this.onPressSendPost()}>
            <Text>Enviar post</Text>
          </Button>
        }
        {this.props.sending === true && <ActivityIndicator animating size="small" style={{ marginTop: 40, marginBottom: 40 }} />}
      </ View>
    </ImageBackground>
  }
}

const mapStateToProps = (state) => {
  return ({
    sending: state.posts.sending,
    postCreated: state.posts.postCreated
  })
}

export default connect(mapStateToProps)(PostScreen)