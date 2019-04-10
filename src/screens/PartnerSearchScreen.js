import React from 'react'
import { connect } from 'react-redux'
import {
  View,
  Image,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
  ImageBackground,
  TextInput
} from 'react-native'
import {
  Card,
  CardItem,
  Thumbnail,
  Text,
  Left,
  Body
} from 'native-base'
import { searchPartners } from '../actions/partners'
import { selectedPartnerForFeed } from '../actions/posts'
import { backgroundImage } from './styles'

const fullWidth = Dimensions.get('window').width - 20

class PartnerSearchScreen extends React.PureComponent {
  static navigationOptions = ({ navigation }) => ({
    title: 'Pesquisa de empresas',
  })

  navigationForFeed(partner) {
    this.props.dispatch(selectedPartnerForFeed(partner))
    this.props.navigation.navigate('PartnerFeed', { partner })
  }

  onPressPost(partner) {
    this.navigationForFeed(partner)
  }

  onPressLogo(partner) {
    this.navigationForFeed(partner)
  }

  keyExtrator = item => item.id.toString()

  renderCardItemBodyImage = (partner, imageUri) => {
    return (
      <View>
        <TouchableOpacity onPress={() => this.onPressPost(partner)}>
          <CardItem cardBody>
            <Image source={{ uri: imageUri }} style={styles.image} />
          </CardItem>
        </TouchableOpacity>
      </View>
    )
  }

  renderCardItemBody = (partner) => {
    if (typeof partner.last_post === 'string') {
      return this.renderCardItemBodyImage(partner, partner.last_post)
    } else {
      return null
    }
  }

  renderItem = ({ item }) => (
    <Card>
      <TouchableOpacity onPress={() => this.onPressLogo(item)}>
        <CardItem>
          <Left>
            <Thumbnail source={{ uri: item.logo }} />
            <Body>
              <Text>{item.name}</Text>
              <Text note>{item.subtitle}</Text>
            </Body>
          </Left>
        </CardItem>
      </TouchableOpacity>
      {this.renderCardItemBody(item)}
    </Card>
  )

  renderFooter = () => {
    if (!this.props.loading) return null

    return (
      <View>
        <ActivityIndicator animating size="large" />
      </View>
    )
  }

  renderEmptyState = () => (
    <ImageBackground style={styles.emptyState.background} source={require('./../static/background.png')} >
      <View style={styles.emptyState.containerMessages}>
        <Text style={styles.emptyState.containerMessages.text}>
          Nenhum resultado encontrado para essa busca.
        </Text>
      </View>
    </ImageBackground >
  )

  onSearchPartners() {
    this.props.dispatch(searchPartners(this.inputSearch.value))
  }

  render() {
    return (
      <ImageBackground style={backgroundImage} source={require('./../static/background.png')} >
        <TextInput
          ref={input => { this.inputSearch = input }}
          clearButtonMode='always'
          placeholder='Pesquisa de empresas'
          clearTextOnFocus={true}
          autoFocus={false}
          label="Pesquisa de empresas"
          autoFocus={true}
          onSubmitEditing={() => { this.onSearchPartners() }}
          style={{
            height: 40,
            width: fullWidth,
            borderColor: 'gray',
            marginLeft: 10,
            borderWidth: 1,
            marginTop: 10,
            marginBottom: 5
          }}
          onChangeText={(text) => {
            this.inputSearch.value = text
          }}
        />
        <FlatList
          onRefresh={() => this.onSearchPartners()}
          refreshing={this.props.loading}
          data={this.props.partners}
          keyExtractor={this.keyExtrator}
          renderItem={this.renderItem}
        />
        {this.props.partners.length === 0 &&
          this.props.loading === false &&
          this.props.search.length > 1 &&
          this.renderEmptyState()}
      </ImageBackground>
    )
  }
}

const styles = {
  image: {
    height: 200,
    width: null,
    flex: 1,
  },
  emptyState: {
    background: {
      resizeMode: 'stretch',
      height: '100%',
      width: '100%',
      flex: 1,
      justifyContent: 'center',
    },
    containerMessages: {
      flexDirection: 'column',
      alignContent: 'center',
      paddingLeft: 15,
      paddingRight: 15,
      text: {
        textAlign: 'center'
      },
      paddingBottom: 50,
    },
    cardItemMessagesText: {
      textAlign: 'center'
    }
  },
  chatIcon: {
    fontSize: 37,
  },
}

const mapStateToProps = (state) => ({
  partners: state.partners.searchPartners,
  search: state.partners.search ? state.partners.search : "",
  loading: state.partners.searchLoading
})

export default connect(mapStateToProps)(PartnerSearchScreen)
