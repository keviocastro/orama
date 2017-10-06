import React from 'react';
import { View,
    Image,
    FlatList,
    ActivityIndicator } from 'react-native';
import { Card, 
    CardItem, 
    Thumbnail, 
    Text, 
    Button, 
    Icon, 
    Left,
    Body, 
    Right } from 'native-base';

import PartnerService from './../services/PartnerService';

export default class PartnerScreen extends React.PureComponent {
    
    static navigationOptions = ({ navigation }) => ({
        title: navigation.state.params.segment.name,
      })

    constructor(props) {
        super(props);

        this.partnerService = new PartnerService();
        this.state = {
            partners: [],
            loading: true       
        }
    }

    componentDidMount() {
        this.partnerService.fetchIfNeeded( (partnersJson) => {
            this.setState({ partners: partnersJson, loading: false });
        } );
    }

    _renderItem = ({item}) => (
        <Card>
            <CardItem>
                <Left>
                    <Thumbnail source={{uri: item.logo.uri}} />
                    <Body>
                        <Text>{item.name}</Text>
                        <Text note>{item.subtitle}</Text>
                    </Body>
                </Left>
            </CardItem>
            <CardItem cardBody>
                <Image source={{uri: item.latest_posts[0].image.uri}} style={styles.image}/>
            </CardItem>
            <CardItem>
                <Left>
                    <Button transparent>
                        <Icon active name="thumbs-up" />
                        <Text>12 Curtidas</Text>
                    </Button>
                </Left>
                <Right>
                    <Text>{item.latest_posts[0].created_at}</Text>
                </Right>
            </CardItem>
        </Card>
    )

    
    _renderFooter = () => {
        if(!this.state.loading) return null;
        
        return (
            <View>
                <ActivityIndicator animating size="large" />
            </View>
        ); 
    }
    
    _keyExtrator = (item) => item.id

    render() {
        return (
            <FlatList  
                data={this.state.partners}
                keyExtractor={this._keyExtrator}
                renderItem={this._renderItem}
                ListFooterComponent={this._renderFooter}
            />
    );
  }
}

const styles = {
    image: {
        height: 200, 
        width: null, 
        flex: 1
    }
}