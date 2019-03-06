import { API_URL } from './../config'
import { login } from './partners'
import firebase from 'react-native-firebase'
const db = firebase.firestore()

const convertSnapshot = (snapshot) => {
  let docs = []
  snapshot.docs.forEach(doc => {
    docs.push(doc.data())
  })
  return docs
}

export const search = (resource, dispatch, receiveAction, initRequestAction, errorAction, filter = []) => {
  dispatch(initRequestAction(filter))
  docRef = db.collection(resource)

  if (Object.keys(filter).length > 0) {
    docRef.where(filter.field, filter.value)
  }
  docRef.orderBy('priority')

  return docRef.get().then(snapshot => {
    let docs = convertSnapshot(snapshot)
    dispatch(receiveAction(docs, filter))
  })
}

export const partnerUpdateFbAcessToken = (dispatch, fbId, fbAcessToken) => {

  return db.collection('partners')
    .where('fb_id', '==', fbId)
    .get()
    .then(snapshot => {
      let batch = db.batch()
      snapshot.docs.forEach(doc => {
        let docRef = db.collection('partners').doc(doc.id)
        batch.update(docRef, { fb_token: fbAcessToken })
        batch.commit()
      })
    })
}

export const checkIsPartner = (dispatch, fbId) => {
  const urlPartnerByFbId = `${API_URL}/partners?fb_id=${fbId}`

  return db.collection('partners')
    .where('fb_id', '==', fbId)
    .get()
    .then(snapshot => {
      if (snapshot.docs.length > 0) {
        return dispatch(login(snapshot.docs[0].data()))
      }
    })
}

const requestError = error => {
  if (__DEV__)
    throw error
}