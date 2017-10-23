import Config from 'react-native-config';

export default class SegmentService {

    fetch(callback) {
        fetch(Config.API_URL+'/segments')
            .then((response) => response.json())
            .then((responseJson) => {
                callback(responseJson);
            });
    }
}