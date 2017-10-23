import React from 'react';
import PropTypes from 'prop-types';
import { View, Text, FlatList, ActivityIndicator, Image, TouchableHighlight } from 'react-native';
import { Card, CardItem } from 'native-base';
import SegmentService from './../services/SegmentService';

export default class SegmentScreen extends React.PureComponent {
  static navigationOptions = {
    title: 'Segmentos',
  };

  constructor(props) {
    super(props);

    this.segmentService = new SegmentService();
    this.state = {
      segments: [],
      loading: true,
    };
  }

  componentDidMount() {
    this.segmentService.fetch((segmentsJson) => {
      this.setState({ segments: segmentsJson, loading: false });
    });
  }

  onPressItem = (item) => {
    this.props.navigation.navigate('Partner', { segment: item });
  };

  keyExtractor = item => item.id;

  renderItem = ({ item }) => (
    <TouchableHighlight onPress={() => this.onPressItem(item)}>
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
    </TouchableHighlight>
  );

  renderFooter = () => {
    if (!this.state.loading) return null;

    return <ActivityIndicator animating size="large" />;
  };

  render() {
    return (
      <FlatList
        data={this.state.segments}
        keyExtractor={this.keyExtractor}
        renderItem={this.renderItem}
        ListFooterComponent={this.renderFooter}
      />
    );
  }
}

SegmentScreen.propTypes = {
  navigation: PropTypes.object,
};
