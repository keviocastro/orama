import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Card, CardItem } from 'native-base';
import { getSegments } from './../actions/segments';

// TODO: melhorar Touchable
class SegmentScreen extends React.PureComponent {
  static navigationOptions = {
    title: 'Segmentos',
  };

  componentWillMount() {
    this.props.dispatch(getSegments());
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.requestError) {
      Alert.alert('Request Error', nextProps.requestError);
    }
  }

  onPressItem = (item) => {
    this.props.navigation.navigate('Partner', { segment: item });
  };

  keyExtractor = item => item.id;

  renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => this.onPressItem(item)}>
      <View>
        <Card>
          <CardItem>
            <Text>{item.name}</Text>
          </CardItem>
          <CardItem cardBody>
            <Image source={{ uri: item.image.uri }} style={{ height: 100, width: null, flex: 1 }} />
          </CardItem>
        </Card>
      </View>
    </TouchableOpacity>
  );

  renderFooter = (isFatching) => {
    if (!isFatching) return null;

    return <ActivityIndicator animating size="large" />;
  };

  render() {
    return (
      <FlatList
        data={this.props.segments}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
        ListFooterComponent={() => this.renderFooter(this.props.isFetching)}
      />
    );
  }
}

SegmentScreen.propTypes = {
  navigation: PropTypes.object,
  dispatch: PropTypes.func,
  segments: PropTypes.array,
  isFetching: PropTypes.bool,
  requestError: PropTypes.string,
};

const mapStateToProps = state => ({
  isFetching: state.segments.isFetching,
  segments: state.segments.data,
  requestError: state.segments.requestError,
});

export default connect(mapStateToProps)(SegmentScreen);
