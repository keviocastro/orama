import React from 'react'
import {
  Image,
  Dimensions,
  FlatList,
  StyleSheet,
  ImageBackground
} from 'react-native'
import { Card, CardItem, Body } from 'native-base'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Button, Text } from 'native-base'
import { getByPartner } from './../actions/posts'
import { backgroundImage } from './styles';

const fullWidth = Dimensions.get('window').width

export class PartnerPostScreen extends React.PureComponent {
  static propTypes = {
    navigation: PropTypes.object,
    dispatch: PropTypes.func
  }
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.partner.name + ' posts'
  })

  get partner() {
    return this.props.navigation.state.params.partner
  }

  componentWillMount() {
    if (this.props.posts.length === 0) {
      this.props.dispatch(getByPartner(this.partner.id))
    }
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
        <Button style={{ width: fullWidth, justifyContent: 'center', marginTop: 10, marginBottom: 10 }}
          info
          onPress={() => { this.props.navigation.navigate('Post', { partner: this.partner }) }}>
          <Text>Novo post</Text>
        </Button>
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