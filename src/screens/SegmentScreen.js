import React from 'react';
import SegmentList from './../components/SegmentList.js';

export default class SegmentScreen extends React.Component {
    static navigationOptions = {
        title: 'Segmentos'
    };

    render(){
        return(
            <SegmentList navigation={this.props.navigation} />
        )
    }
}