import React from 'react'
import { View, TextInput, Dimensions } from 'react-native'
import { Button, Text } from 'native-base'
import { connect } from 'react-redux'
import { sendPost } from './../actions/posts'
import ImagePicker from 'react-native-image-picker'

const fullWidth = Dimensions.get('window').width

class PostScreen extends React.Component {

  constructor(props) {
    super(props)

    this.imagePicker = ImagePicker
  }

  componentWillReceiveProps(props) {
    if (props.postCreated) {
      if (typeof this.imagePicker.image === 'string' && this.imagePicker.image.length > 0) {
        this.props.dispatch(updateLatestPosts(this.partner.id, this.imagePicker.image))
      }
      if (props.clearForm) {
        this.inputText.clear()
        this.imagePicker.image = null
      }
    }
  }

  onPressSendPost() {
    this.props.dispatch(sendPost(this.inputText.value, this.imagePicker.image, this.partner.id))
  }

  render() {
    return <View style={{ flexDirerection: 'column', justifyContent: 'center', alignItens: 'center', marginTop: 20 }} >
      <TextInput
        ref={input => { this.inputText = input }}
        clearButtonMode='always'
        placeholder='Texto do post'
        clearTextOnFocus={true}
        autoFocus={false}
        label="Texto do post"
        style={{ height: 40, width: fullWidth, borderColor: 'gray', borderWidth: 1, marginTop: 2 }}
        onChangeText={(text) => {
          this.inputText.value = text
        }}
        multiline={true}
        numberOfLines={2}
      />
      {typeof this.imagePicker.image !== 'string' &&
        <Button style={{ width: fullWidth, justifyContent: 'center', alignItens: 'start', height: 200 }}
          info
          onPress={() => this.onPressUploadPhoto()}
        >
          <Text>Photo</Text>
        </Button>
      }
      {typeof this.imagePicker.image === 'string' &&
        <TouchableOpacity onPress={() => this.onPressUploadPhoto()} >
          <Image source={{ uri: this.imagePicker.image }} style={{ width: fullWidth, height: 200 }} />
        </TouchableOpacity>
      }
      {!this.props.sending && !this.props.postCreated &&
        <Button style={{ width: fullWidth, justifyContent: 'center', marginTop: 2, marginBottom: 40 }}
          info
          onPress={() => this.onPressSendPost()}>
          <Text>Enviar post</Text>
        </Button>
      }
      {this.props.sending === true && <ActivityIndicator animating size="small" style={{ marginTop: 40, marginBottom: 40 }} />}
    </ View>
  }
}

const mapStateToProps = (state) => {
  return ({
    sending: state.posts.sending,
    partnerId: state.posts.partnerId,
    postCreated: state.posts.postCreated,
    clearForm: state.posts.clearForm
  })
}

export default connect(mapStateToProps)(PostScreen)