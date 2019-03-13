import React, { Component } from 'react'
import { View, Image, TextInput, Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImagePicker from 'react-native-image-picker'
import { Button, Text } from 'native-base'
import { sendPost, clearForm } from './../actions/posts'

const contentWidth = Dimensions.get('window').width - 10

const options = {
  title: 'Foto do seu novo post',
  takePhotoButtonTitle: 'Tire uma foto',
  chooseFromLibraryButtonTitle: 'Ou escolha da galeria',
  storageOptions: {
    skipBackup: true,
    path: 'o-rama',
  },
};

export class PartnerPostScreen extends Component {
  static propTypes = {
    navigation: PropTypes.object,
    dispatch: PropTypes.func
  }
  static navigationOptions = ({ navigation }) => ({
    title: 'Seus posts'
  })

  componentWillMount() {
    this.setState({
      image: null,
    });
  }

  onPressUploadPhoto() {
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const base64 = 'data:image/jpeg;base64,' + response.data;

        this.setState({
          image: base64,
        });

      }
    });
  }

  onPressSendPost() {
    this.props.dispatch(sendPost(this.state.text, this.state.image, 1))
  }

  renderMessageSended() {
    if (this.props.postCreated) {
      setTimeout(() => {
        this.props.dispatch(clearForm())
      }, 200)

      return (<Text style={{ color: 'red', width: contentWidth, textAlign: 'center', marginTop: 40 }}>Post enviado</Text>)
    }
  }

  render() {
    return (
      <View style={{ flexDirerection: 'column', justifyContent: 'center', alignItens: 'center', marginTop: 20 }} >
        <TextInput
          clearButtonMode='always'
          placeholder='Texto do post'
          clearTextOnFocus={true}
          autoFocus={true}
          label="Texto do post"
          style={{ height: 40, width: contentWidth, borderColor: 'gray', borderWidth: 1 }}
          onChangeText={(text) => {
            this.setState({ text: text })
          }}
          multiline={true}
          numberOfLines={2}
        />
        {this.state.image === null &&
          <Button style={{ width: contentWidth, justifyContent: 'center', alignItens: 'start', height: 200 }}
            info
            onPress={() => this.onPressUploadPhoto()}
          >
            <Text>Photo</Text>
          </Button>
        }
        {this.state !== null && this.state.image !== null &&
          <TouchableOpacity onPress={() => this.onPressUploadPhoto()} >
            <Image source={{ uri: this.state.image }} style={{ width: contentWidth, height: 200 }} />
          </TouchableOpacity>
        }
        {this.renderMessageSended()}
        {!this.props.sending && !this.props.postCreated &&
          <Button style={{ width: contentWidth, justifyContent: 'center', marginTop: 40 }}
            success
            onPress={() => this.onPressSendPost()}>
            <Text>Enviar post</Text>
          </Button>
        }
        {this.props.sending === true && <ActivityIndicator animating size="small" style={{ marginTop: 40 }} />}
      </ View>
    )
  }
}

const mapStateToProps = (state) => ({
  sending: state.posts.sending,
  text: state.posts.text,
  image: state.posts.image,
  partnerId: state.posts.partnerId,
  postCreated: state.posts.postCreated
})

export default connect(mapStateToProps)(PartnerPostScreen)