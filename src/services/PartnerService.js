import Config from 'react-native-config';

export default class PartnerService {
  static getPartnersBySegment(callback, segmentId) {
    fetch(`${Config.API_URL}/partners?segmentIds_like=${segmentId}`)
      .then(response => response.json())
      .then((responseJson) => {
        callback(responseJson);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
