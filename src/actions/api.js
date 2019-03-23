import firebase from 'react-native-firebase'
import { addLoggedUser, invalidPass, redirectToAccount } from './auth'
const db = firebase.firestore()

const convertSnapshot = (snapshot) => {
  let docs = []
  snapshot.docs.forEach(doc => {
    docs.push({ ...doc.data(), id: doc.id })
  })
  return docs
}

// @todo refactore to gcloud functions
export const updateLatestPostsByPartner = (partnerId, image) => {
  // let query = db.collection('posts')
  //   .where('partner_id', '==', partnerId)
  //   .orderBy('created_at', 'desc')
  //   .limit(3)

  // query.get().then(snapshot => {
  //   let images = []
  //   snapshot.docs.forEach(doc => {
  //     let data = doc.data()
  //     if (typeof data.image === 'string' && data.image.length > 0) {
  //       images.push(data.image)
  //     }
  //   })

  db.collection('partners').doc(partnerId).update({ last_post: image })
  // })
}

export const get = (resource, filter = {}, orderBy = {}, dispatch, realtime, loadingAction, receiveAction) => {
  if (typeof loadingAction === 'function') {
    dispatch(loadingAction(true))
  }

  let query = db.collection(resource)

  let orderFields = Object.keys(orderBy)
  if (orderFields.length > 0) {
    orderFields.forEach(field => {
      query = query.orderBy(field, orderBy[field])
    })
  }

  let filterFields = Object.keys(filter)
  if (filterFields.length > 0) {
    filterFields.forEach(field => {
      query = query.where(field, '==', filter[field])
    })
  }

  if (realtime) {
    return query.onSnapshot(snapshot => {
      let docs = convertSnapshot(snapshot)
      dispatch(receiveAction(docs, filter))
      if (typeof loadingAction === 'function') {
        dispatch(loadingAction(false))
      }
    })
  } else {
    return query.get()
      .then(snapshot => {
        let docs = convertSnapshot(snapshot)
        dispatch(receiveAction(docs, filter))
        if (typeof loadingAction === 'function') {
          dispatch(loadingAction(false))
        }
      }).catch(err => {
        console.log('Firestore error', err)
      })
  }
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
export const add = function (resource, data, dispatch, receiveAction, errorAction, loadingAction) {
  docRef = db.collection(resource)
  data = Array.isArray(data) ? data : [data]
  let countTerminated = 0

  if (typeof loadingAction === 'string') {
    dispatch(loadingAction(true))
  }

  data.forEach(item => {
    const timestamp = firebase.firestore.FieldValue.serverTimestamp()
    item['created_at'] = timestamp
    docRef.add(item)
      .then(snapshot => {
        countTerminated++
        if (countTerminated === data.length && typeof loadingAction === 'function') {
          dispatch(loadingAction(false))
        }
        if (typeof receiveAction === 'function') {
          item.id = snapshot.id;
          dispatch(receiveAction(item));
        }
      }).catch(err => {
        if (typeof errorAction === 'function') {
          dispatch(errorAction(err));
          countTerminated++
        }
      })
  })
}

export const partnerLogin = (pass, dispatch, loadingAction) => {
  docRef = db.collection('partners')
  dispatch(loadingAction(true))

  return db.collection('partners')
    .where('pass', '==', pass)
    .get()
    .then(snapshot => {
      let docs = snapshot.docs
      if (docs.length >= 1) {
        dispatch(addLoggedUser(null, null, docs[0].data()))
        dispatch(invalidPass(false))
        dispatch(redirectToAccount(true))
      }
      dispatch(loadingAction(false))
      dispatch(redirectToAccount(false))
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