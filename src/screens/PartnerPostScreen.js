import React from 'react'
import {
  Image,
  Dimensions,
  FlatList,
  StyleSheet,
  ImageBackground,
  Modal,
  View,
  TouchableNativeFeedback,
  ScrollView
} from 'react-native'
import ImageZoom from 'react-native-image-pan-zoom'
import { Card, CardItem, Body } from 'native-base'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Text } from 'native-base'
import { getByPartner, removePost } from './../actions/posts'
import { backgroundImage } from './styles'
import AutoHeightImage from 'react-native-auto-height-image'

const fullWidth = Dimensions.get('window').width
const viewportHeight = Dimensions.get('window').height
const modalImagemHeight = viewportHeight - (viewportHeight * 0.25)
const modalImageWidth = Dimensions.get('window').width

export class PartnerPostScreen extends React.PureComponent {
  static propTypes = {
    navigation: PropTypes.object,
    dispatch: PropTypes.func
  }
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.partner.name + ' posts'
  })

  state = {
    modalVisible: false,
    modalImage: null,
    modalPostId: null
  }

  get partner() {
    return this.props.navigation.state.params.partner
  }

  renderItemPost({ item, index }) {
    return (
      <TouchableNativeFeedback onPress={() => {
        this.setState({
          modalVisible: true,
          modalImage: item.image,
          modalPostId: item.id
        })
      }}>
        <Card styles={styles.card}>
          {item.text !== undefined && item.text !== null > 0 &&
            <CardItem >
              <Body>
                <Text>{item.text}</Text>
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
    const { posts, loading, dispatch, navigation } = this.props
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
          <ImageBackground source={require('./../static/background-modal-images.jpg')}
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <View style={{
              width: fullWidth,
              flexDirection: 'row',
              justifyContent: 'space-between'
            }}>
              <TouchableNativeFeedback onPress={() => {
                this.setState({
                  modalVisible: false
                })
              }}>
                <Image style={{ width: 50, height: 50, marginTop: 10, marginLeft: 20 }} source={require('./../static/icon-back.png')} />
              </TouchableNativeFeedback>
              <TouchableNativeFeedback onPress={() => {
                this.setState({
                  modalVisible: false
                })
                dispatch(removePost(this.state.modalPostId))
              }}>
                <Image style={{ height: 40, width: 40, marginTop: 10, marginRight: 20 }} source={require('./../static/icon-remove.png')} />
              </TouchableNativeFeedback>
            </View>
            <ScrollView contentContainerStyle={{ marginTop: 10 }}>
              <AutoHeightImage source={{ uri: this.state.modalImage }} width={fullWidth} />
            </ScrollView>
          </ImageBackground>
        </Modal>
        {!loading &&
          <Button style={{ width: fullWidth, justifyContent: 'center', marginTop: 10, marginBottom: 10 }}
            info
            onPress={() => { navigation.navigate('Post', { partner: this.partner, title: 'Nova postagem' }) }}>
            <Text>Novo post</Text>
          </Button>}
        <FlatList
          ref={list => { this.postList = list }}
          data={posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => this.renderItemPost({ item, index })}
          refreshing={loading} />
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
    loading: state.posts.loading,
    posts: state.posts.postsByPartner[state.auth.partner.id],
    partnerId: state.posts.partnerId
  })
}

export default connect(mapStateToProps)(PartnerPostScreen)