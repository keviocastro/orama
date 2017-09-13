import React, { Component } from 'react';
import { 
    Content,
    List,
    ListItem,
    Text,
    Left,
    Icon,
    Body } from 'native-base';

export default class SegmentList extends Component {
    static navigationOptions = {
        title: 'Parceiros'
    }
    
    render() {
        return (
            <List>
                <ListItem icon onPress={
                            () => this.props.navigation.navigate('Partner')
                    }>
                <Left>
                    <Icon name="cart" />
                </Left>
                <Body>
                    <Text>Supermercados</Text>
                </Body>
                </ListItem>
                <ListItem icon>
                <Left>
                    <Icon name="beer"/>
                </Left>
                <Body>
                    <Text>Bebidas</Text>
                </Body>
                </ListItem>
            </List>
        );
    }
}
