import Config from 'react-native-config';

export default class PartnerService {
    
    fetchIfNeeded(callback) {
        fetch(Config.API_URL+'/partners')
            .then((response) => response.json())
            .then((responseJson) => {
                callback(responseJson);
            });
    }

}