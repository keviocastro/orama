import React, { Component } from 'react';
import { View, Text, FlatList, ActivityIndicator, Image, TouchableHighlight} from 'react-native';
import SegmentService from './../services/SegmentService';
import {Card} from 'react-native-elements';

export default class SegmentScreen extends React.PureComponent {
    static navigationOptions = {
        title: 'Segmentos'
    }

    constructor(props) {
        super(props);
        
        this.segmentService = new SegmentService();
        this.state = {
            segments: [],
            loading: true
        }
    };

    componentDidMount() {
        this.segmentService.fetchIfNeeded( (segmentsJson) => {
            this.setState({ segments: segmentsJson, loading: false });
        } );
    }

    _onPressItem = (item) => {
        this.props.navigation.navigate('Partner', {segment: item});
    }

    _renderItem = ({item}) => (
        <TouchableHighlight onPress={ () => this._onPressItem(item) } >
            <View>
                <Card
                    title={item.name}
                    image={{uri: item.image.uri}}
                />
            </View>
        </TouchableHighlight>
    );

    _keyExtractor = (item, index) => item.id;

    _renderFooter = () => {
        if(!this.state.loading) return null;

        return (
            <ActivityIndicator animating size='large' />
        );
    }

    render(){
        return(
            <FlatList
                data={this.state.segments}
                keyExtractor={this._keyExtractor}
                renderItem={this._renderItem}
                ListFooterComponent={this._renderFooter}
            />
        )
    };
}