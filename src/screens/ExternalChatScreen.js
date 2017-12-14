import React from 'react';
import PropTypes from 'prop-types';
import { Text, Linking } from 'react-native';
import { Card, CardItem, Right, Icon, Thumbnail } from 'native-base';
import { connect } from 'react-redux';
import ReactNativeParallaxHeader from 'react-native-parallax-header';

const Logo = props => <Thumbnail large source={{ uri: props.partner.logo.uri }} />;

class ExternalChatScreen extends React.Component {
  // static navigationOptions = ({ navigation }) => ({
  //   title: <Header partner={navigation.state.params.partner}>hi</Header>,
  // });

  constructor(props) {
    super(props);
    this.onPressContact = this.onPressContact.bind(this);
  }

  onPressContact(contact) {
    switch (contact.type) {
      case 'facebook-messenger':
        this.openLink(`https://www.messenger.com/t/${contact.identifier}`);
        break;
      case 'whatsapp':
        this.openLink(`https://api.whatsapp.com/send?phone=${contact.identifier}`);
        break;
      case 'phone':
        this.openLink(`tel:${contact.identifier}`);
        break;
      default:
        console.log('onPressContact: contact type no provided');
        break;
    }
  }

  openLink(link) {
    Linking.canOpenURL(link)
      .then((supported) => {
        if (supported) {
          Linking.openURL(link);
        } else {
          // TODO: register error
          console.log('Error on open link: ', link);
        }
      })
      .catch((err) => {
        // TODO: registrer error
        console.error('Error, openExternalChat: ', err);
      });
  }

  renderContactIcon(contact) {
    switch (contact.type) {
      case 'facebook-messenger':
        return <Icon name={contact.type} style={{ color: '#0077FF' }} />;
      case 'whatsapp':
        return <Icon name={contact.type} style={{ color: '#00E45B' }} />;
      default:
        return <Icon name="contacts" />;
    }
  }

  render() {
    const { contacts } = this.props.partner;

    return (
      <ReactNativeParallaxHeader
        headerMinHeight={90}
        headerMaxHeight={200}
        extraScrollHeight={20}
        navbarColor="#F7F7F7"
        title={<Logo partner={this.props.partner} />}
        backgroundImage={{ uri: 'http://localhost:3003/images/partners/covers/cover-1.jpg' }}
        backgroundImageScale={1.2}
        renderContent={() => (
          <Card>
            <CardItem header>
              <Text>Contatos</Text>
            </CardItem>
            {contacts.map((item, index) => (
              <CardItem key={index} button onPress={() => this.onPressContact(item)}>
                {this.renderContactIcon(item)}
                <Text>{item.name}</Text>
                <Right style={{ flex: 1 }}>
                  <Icon name="chevron-right" />
                </Right>
              </CardItem>
            ))}
          </Card>
        )}
      />
    );
  }
}

ExternalChatScreen.propTypes = {
  partner: PropTypes.object,
  navigation: PropTypes.object,
};

const mapStateToProps = state => ({
  partner: state.partners.partnerSelected,
});

export default connect(mapStateToProps)(ExternalChatScreen);
