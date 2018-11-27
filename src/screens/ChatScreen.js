import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { GiftedChat } from 'react-native-gifted-chat';
import { showWelcomeMessages, sendMessages } from '../actions/chat';

const loggedInUser = {
  _id: 1210
}

class ChatScreen extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.partner.name,
  });

  componentWillMount() {
    console.log(this.props.navigation.state.params.partner);
    this.props.dispatch(showWelcomeMessages(this.props.navigation.state.params.partner));
  }

  onSend(messages = []) {
    this.props.dispatch(sendMessages(messages, loggedInUser));
  }

  render() {
    return (
      <GiftedChat
        messages={this.props.messages}
        onSend={messages => this.onSend2()}
        user={loggedInUser}
      />
    )
  }

  onSend2() {
    return true;
  }

}

ChatScreen.propTypes = {
  partner: PropTypes.object,
  navigation: PropTypes.object,
};

const mapStateToProps = state => {
  return ({
    partner: state.partners.partnerSelected,
    messages: state.chat.messages
  })
};

export default connect(mapStateToProps)(ChatScreen);
