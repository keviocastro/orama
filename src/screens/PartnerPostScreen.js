import React from 'react'
import {
  Image,
  Dimensions,
  FlatList,
  StyleSheet,
  ImageBackground,
  Modal,
  View,
  TouchableOpacity
} from 'react-native'
import ImageZoom from 'react-native-image-pan-zoom'
import { Card, CardItem, Body } from 'native-base'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Text } from 'native-base'
import { getByPartner, removePost } from './../actions/posts'
import { backgroundImage } from './styles'

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

  constructor(props) {
    super(props)

    this.state = {
      modalVisible: false,
      modalImage: null,
      modalPostId: null
    }
  }

  get partner() {
    return this.props.navigation.state.params.partner
  }

  renderItemPost({ item, index }) {
    return (
      <TouchableOpacity onPress={() => {
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
              <Image source={{ uri: item.image }} style={styles.image} />
            </CardItem>
          }
        </Card>
      </TouchableOpacity>
    )
  }

  render() {
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
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "black" }}>
            <TouchableOpacity onPress={() => {
              this.setState({
                modalVisible: false
              })
              this.props.dispatch(removePost(this.state.modalPostId))
              this.props.dispatch(getByPartner(this.partner.id))
            }}>
              <Image style={{ height: 30, width: 30, marginBottom: 10 }} source={require('./../static/icon-remove.png')} />
            </TouchableOpacity>
            <ImageZoom
              cropWidth={modalImageWidth}
              cropHeight={modalImagemHeight}
              imageWidth={modalImageWidth}
              imageHeight={modalImagemHeight} >
              <Image style={{ width: modalImageWidth, height: modalImagemHeight, resizeMode: "stretch" }}
                source={{ uri: this.state.modalImage }}
              />
            </ImageZoom>
            <TouchableOpacity onPress={() => {
              this.setState({
                modalVisible: false
              })
            }}>
              <Image style={{ width: 50, height: 50, marginTop: 10, backgroundColor: 'black' }} source={require('./../static/icon-down.png')} />
            </TouchableOpacity>
          </View>
        </Modal>
        {!this.props.loading &&
          <Button style={{ width: fullWidth, justifyContent: 'center', marginTop: 10, marginBottom: 10 }}
            info
            onPress={() => { this.props.navigation.navigate('Post', { partner: this.partner, title: 'Nova postagem' }) }}>
            <Text>Novo post</Text>
          </Button>}
        <FlatList
          ref={list => { this.postList = list }}
          data={this.props.posts}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => this.renderItemPost({ item, index })}
          onRefresh={() => { this.props.dispatch(getByPartner(this.partner.id)) }}
          refreshing={this.props.loading} />
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
    posts: state.posts.posts,
    partnerId: state.posts.partnerId
  })
}

export default connect(mapStateToProps)(PartnerPostScreen)