/**
 * @todo Não está sendo utilizado o package react-native-fbsdk
 *  porque não é possível utiliza-lo sem utilizar fbLogin.
 */
export default class PartnerFeedService {
  static getPartnerFeed(partner, callback) {
    const token = encodeURIComponent(partner.fb_token);
    const baseUrl = 'https://graph.facebook.com/v2.11/';
    const endPoint = `${partner.fb_id}/feed/`;
    const fields =
      'type,story,picture,full_picture,message,message_tags,attachments{type,media,url,subattachments}';
    const url = `${baseUrl + endPoint}?access_token=${token}&fields=${fields}`;

    fetch(url)
      .then(response => response.json())
      .then(responseJson => callback(responseJson, false))
      .catch(error => callback([], error));
  }
}
