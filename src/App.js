import React, { Component } from 'react';
import { AppRegistry, StyleSheet } from 'react-native';
import { 
  Container,
  Header,
  Content,
  List,
  ListItem,
  Text,
  Left,
  Icon,
  Body } from 'native-base';

export default class App extends Component {
  render() {
    return (
      <Container>
        <Header />
        <Content>
          <List>
            <ListItem icon>
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
        </Content>
      </Container>
    );
  }
}

AppRegistry.registerComponent('App', () => App);
