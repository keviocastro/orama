import { FB_APP_ACCESS_TOKEN } from './../config'

const feed = (partner, dispatch, receiveAction, requestAction, errorAction) => {
  dispatch(requestAction(partner))

  const token = encodeURIComponent(FB_APP_ACCESS_TOKEN)
  const baseUrl = 'https://graph.facebook.com/v2.11/'
  const endPoint = `${fbUserId}/feed/`

  const fields =
    'type,story,picture,full_picture,message,message_tags,attachments{type,media,url,subattachments}'
  const url = `${baseUrl + endPoint}?access_token=${token}&fields=${fields}`

  return fetch(url)
    .then((response) => {
      if (!response.ok) dispatch(errorAction(`Request error with status ${response.status}`))

      return response.json()
    })
    .then((json) => {
      dispatch(receiveAction(json, partner))
    })
    .catch((err) => {
      if (__DEV__) {
        throw err
      } else {
        dispatch(errorAction(err))
      }
    })
}

export default feed
