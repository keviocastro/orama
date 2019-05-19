import React from 'react'
import {
  View,
  TextInput,
  Dimensions,
  ActivityIndicator,
  ImageBackground,
  Image
} from 'react-native'
import { Button, Text } from 'native-base'
import { connect } from 'react-redux'
import PhotoUpload from 'react-native-photo-upload'
import { sendPost, updateLatestPosts, getByPartner } from './../actions/posts'
import { getPartners } from './../actions/partners'
import { loadDataLoggedPartner } from './../actions/auth'
import { sendNotification } from './../actions/notifications'
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
    title: navigation.state.params.title
  })

  state = {
    height: 250,
    formValid: false,
    inputHeight: 40
  }

  get partner() {
    return this.props.navigation.state.params.partner
  }

  get notify() {
    return this.props.navigation.state.params.notify || false
  }

  componentWillReceiveProps(props) {
    if (props.postCreated) {
      this.props.dispatch(updateLatestPosts(this.partner.id, this.state.image))
    }

    if (props.postCreated || props.notificationSend) {
      this.inputText.clear()
      this.setState({
        image: null,
      })
      this.props.navigation.goBack()
    }

  }

  onPressSendPost() {
    if (this.notify) {
      let notifcation = {
        title: this.partner.name,
        body: this.inputText.value,
        image: this.state.image,
        partner_id: this.partner.id,
        topic: 'orama'
      }
      this.props.dispatch(sendNotification(notifcation))
    } else {
      this.props.dispatch(sendPost(this.inputText.value, this.state.image, this.partner.id))
      if (typeof this.partner.segmentIds === 'array') {
        this.partner.segmentIds.forEach(segmentId => {
          this.props.dispatch(getPartners(segmentId))
        })
      }
      this.props.dispatch(getByPartner(this.partner.id))
    }

    this.props.dispatch(loadDataLoggedPartner(this.partner.id))
  }

  checkValidFom() {
    if (typeof this.inputText.value === 'string' &&
      this.inputText.value.length >= 3 &&
      typeof this.state.image === 'string' && this
        .state.image.indexOf('data:image/jpeg;base64,') !== -1) {

      this.setState({
        formValid: true
      })
    }
  }

  render() {
    let placeholder = this.notify ? 'Texto da notificação' : 'Texto do post'

    return <ImageBackground style={backgroundImage} source={require('./../static/background.png')} >
      <View style={{ flexDirerection: 'column', justifyContent: 'flex-start', alignItens: 'center', flex: 1, marginTop: 20 }} >
        <TextInput
          ref={input => { this.inputText = input }}
          clearButtonMode='always'
          placeholder={placeholder}
          clearTextOnFocus={true}
          autoFocus={false}
          label={placeholder}
          style={{ height: this.state.inputHeight, width: fullWidth, borderColor: 'gray', marginLeft: 10, borderWidth: 1, marginTop: 2 }}
          onChangeText={(text) => {
            this.inputText.value = text
            this.checkValidFom()
          }}
          multiline={true}
          onContentSizeChange={(e => {
            this.setState({
              inputHeight: e.nativeEvent.contentSize.height
            })
          })}
        />
        <View style={{
          height: this.state.height,
          marginTop: 10
        }}>
          <PhotoUpload
            photoPickerTitle="Escolha uma foto"
            maxHeight={350}
            onPhotoSelect={image => {
              if (image) {
                this.setState({
                  image: 'data:image/jpeg;base64,' + image,
                  height: 350
                })
              }
              this.checkValidFom()
            }}>
            <Image
              style={{ width: fullWidth, flex: 1, resizeMode: 'cover' }}
              resizeMode='cover'
              source={require('./../static/upload-image.png')}
            />
          </PhotoUpload>
        </View>
        {!this.props.sending &&
          this.state.formValid &&
          <Button style={{ width: fullWidth, justifyContent: 'center', marginLeft: 10, marginTop: 40, marginBottom: 40 }}
            info
            onPress={() => this.onPressSendPost()}>
            {!this.notify && <Text>Enviar post</Text>}
            {this.notify && <Text>Enviar notificação</Text>}
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
    postCreated: state.posts.postCreated,
    notificationSend: state.notifications.notificationSend
  })
}

export default connect(mapStateToProps)(PostScreen)