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
  query = docRef.orderBy('priority')

  if (Object.keys(filter).length > 0) {
    query.where(filter.field, filter.value)
  }

  return query.get().then(snapshot => {
    let docs = convertSnapshot(snapshot)
    dispatch(receiveAction(docs, filter))
  })
}

// @todo Refator to batch
export const add = function (resource, data, dispatch, receiveAction, errorAction) {
  docRef = db.collection(resource)
  data = Array.isArray(data) ? data : [data]

  data.forEach(item => {
    docRef.add(item)
      .then(snapshot => {
        if (typeof receiveAction === 'function') {
          dispatch(receiveAction(resource, snapshot.data()));
        }
      }).catch(err => {
        if (typeof errorAction === 'function') {
          dispatch(errorAction(err));
        }
      })
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