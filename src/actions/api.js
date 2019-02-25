import { API_URL } from './../config'
import { login } from './partners'

const requestError = error => {
  if (__DEV__)
    throw error
}

export const search = (resource, dispatch, receiveAction, initRequestAction, errorAction, filter = []) => {
  dispatch(initRequestAction(filter))
  let query = ''

  if (Object.keys(filter).length > 0) {
    query = `?${filter.field}_like=${filter.value}&_sort=priority,name`
  } else {
    query = `?_sort=priority,name`
  }

  const url = `${API_URL}/${resource}${query}`

  return fetch(url).then((response) => {
    if (!response.ok) dispatch(errorAction(`Request error with status ${response.status}`))
    return response.json()
  }).then((result) => {
    dispatch(receiveAction(result, filter))
  }).catch(err => requestError(error))
}

export const partnerUpdateFbAcessToken = (dispatch, fbId, fbAcessToken) => {
  const urlPartnerByFbId = `${API_URL}/partners?fb_id=${fbId}`

  return fetch(urlPartnerByFbId).then((response) => {
    if (response.ok) return response.json()
  }).then((result) => {
    let partner = Array.isArray(result) && result.length > 0
      ? result[0]
      : false

    if (partner) {
      const urlUpdate = `${API_URL}/partners/${partner.id}`
      partner.fb_token = fbAcessToken

      fetch(urlUpdate, {
        body: JSON.stringify(partner),
        method: 'PUT',
        headers: new Headers({
          'Content-Type': 'application/json'
        })
      }).catch(err => requestError(error))
    }
  }).catch(err => requestError(error))
}

export const checkIsPartner = (dispatch, fbId) => {
  const urlPartnerByFbId = `${API_URL}/partners?fb_id=${fbId}`

  return fetch(urlPartnerByFbId).then((response) => {
    if (response.ok) return response.json()
  }).then((result) => {
    let partner = Array.isArray(result) && result.length > 0
      ? result[0]
      : false

    if (partner) {
      dispatch(login(partner))
    }
  })
}