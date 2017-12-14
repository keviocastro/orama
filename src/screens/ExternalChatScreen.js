import React from 'react';
import PropTypes from 'prop-types';
import { Text, Linking } from 'react-native';
import { Content, Card, CardItem, Right, Icon } from 'native-base';
import { connect } from 'react-redux';

class ExternalChatScreen extends React.Component {
  static navigationOptions = {
    title: 'Contatos',
  };

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
      <Content>
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
      </Content>
    );
  }
}

ExternalChatScreen.propTypes = {
  partner: PropTypes.object,
};

const mapStateToProps = state => ({
  partner: state.partners.partnerSelected,
});

export default connect(mapStateToProps)(ExternalChatScreen);
