import React, { Component } from 'react'
import {
  View,
  Image,
  TextInput,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  StyleSheet,
  ImageBackground
} from 'react-native'
import { Card, CardItem, Body } from 'native-base'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import ImagePicker from 'react-native-image-picker'
import { Button, Text } from 'native-base'
import { sendPost, clearForm, getOnUpdate, selectImage, getByPartner } from './../actions/posts'
import { backgroundImage } from './styles';

const contentWidth = Dimensions.get('window').width - 10
const fullWidth = Dimensions.get('window').width

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
    title: navigation.state.params.partner.name + ' posts'
  })

  componentWillMount() {
    if (this.props.posts.length === 0) {
      this.props.dispatch(getByPartner(this.props.partnerId))
    }
    this.setState({
      image: null,
    });
  }

  componentWillReceiveProps(props) {
    if (props.clearForm) {
      this.setState({
        image: null
      })
      this.inputText.clear()
    }
  }

  onPressUploadPhoto() {
    ImagePicker.showImagePicker(options, (response) => {
      if (response.didCancel) {

      } else if (response.error) {

      } else if (response.customButton) {

      } else {
        const base64 = 'data:image/jpeg;base64,' + response.data;

        this.setState({
          image: base64
        });
      }
    });
  }

  onPressSendPost() {
    this.props.dispatch(sendPost(this.inputText.value, this.state.image, this.props.partnerId))
  }

  renderMessageSended() {
    if (this.props.postCreated) {
      setTimeout(() => {
        this.props.dispatch(clearForm())
      }, 200)

      return (<Text style={{ color: 'red', width: contentWidth, textAlign: 'center', marginTop: 2, marginBottom: 40 }}>Post enviado</Text>)
    }
  }

  renderForm(post) {
    return <View style={{ flexDirerection: 'column', justifyContent: 'center', alignItens: 'center', marginTop: 20 }} >
      {this.state.image === null &&
        <Button style={{ width: fullWidth, justifyContent: 'center', alignItens: 'start', height: 200 }}
          info
          onPress={() => this.onPressUploadPhoto()}
        >
          <Text>Photo</Text>
        </Button>
      }
      {this.state !== null && this.state.image !== null &&
        <TouchableOpacity onPress={() => this.onPressUploadPhoto()} >
          <Image source={{ uri: this.state.image }} style={{ width: fullWidth, height: 200 }} />
        </TouchableOpacity>
      }
      {this.renderMessageSended()}
      {!this.props.sending && !this.props.postCreated &&
        <Button style={{ width: fullWidth, justifyContent: 'center', marginTop: 2, marginBottom: 40 }}
          success
          onPress={() => this.onPressSendPost()}>
          <Text>Enviar post</Text>
        </Button>
      }
      {this.props.sending === true && <ActivityIndicator animating size="small" style={{ marginTop: 40, marginBottom: 40 }} />}
    </ View>
  }

  renderItemPost({ item, index }) {
    return (
      <Card styles={styles.card}>
        {item.text !== undefined && item.text !== null > 0 &&
          <CardItem >
            <Body>
              <Text>{item.text}</Text>
            </Body>
          </CardItem>}
        {item.image !== undefined && item.text !== null > 0 &&
          <CardItem cardBody style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.image} />
          </CardItem>
        }
      </Card>
    )
  }

  render() {
    return (
      <ImageBackground style={backgroundImage} source={require('./../static/background.png')} >
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
        {this.renderForm()}
        <FlatList
          ref={list => { this.postList = list }}
          data={this.props.posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => this.renderItemPost({ item, index })} />
      </ImageBackground>
    )
  }
}

const styles = StyleSheet.create({
  card: { paddingBottom: 2, paddingBottom: 2 },
  image: { height: 200, width: null, flex: 1, resizeMode: 'stretch' }
})

const mapStateToProps = (state) => {
  return ({
    loading: state.posts.loading,
    sending: state.posts.sending,
    posts: state.posts.posts,
    text: state.posts.text,
    image: state.posts.image,
    partnerId: state.posts.partnerId,
    postCreated: state.posts.postCreated,
    clearForm: state.posts.clearForm
  })
}

export default connect(mapStateToProps)(PartnerPostScreen)