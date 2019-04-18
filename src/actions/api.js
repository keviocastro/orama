import firebase from 'react-native-firebase'
import { addLoggedUser, invalidPass, redirectToAccount } from './auth'
const db = firebase.firestore()

const convertSnapshot = (snapshot) => {
  let docs = []
  snapshot.docChanges.forEach(change => {
    let data = change.doc.data()
    data.id = change.doc.id
    docs.push(change.doc.data())
  })

  return docs
}

export const remove = (resource, id) =>
  db.collection(resource).doc(id).delete()

export const update = (resource, id, data) =>
  db.collection(resource).doc(id).update(data)


export const getOne = (resource, id, dispatch, receiveAction) => {
  return db.collection(resource)
    .doc(id)
    .get()
    .then(snapshot => {
      let doc = snapshot.data()
      dispatch(receiveAction(doc))
    })
}

export const updateChatLastMessage = (messages, partner, user) => {
  return db.collection('chats')
    .where('partner_id', '==', partner.id)
    .where('user_id', '==', user.id)
    .get()
    .then(snapshot => {
      snapshot.docs.map(chat => {
        db.collection('chats').doc(chat.id).update({
          last_message: messages[messages.length - 1].text,
          time: currentTime(),
          unread: 1
        })
      })
    })
}

export const updateChatImages = (partnerId, userId, images) => {
  return db.collection('chats')
    .where('partner_id', '==', partnerId)
    .where('user_id', '==', userId)
    .get()
    .then(snapshot => {
      snapshot.docs.map(chat => {
        db.collection('chats').doc(chat.id).update({
          images: images
        })
      })
    })
}

export const updateLatestPostsByPartner = (partnerId, image) => {
  db.collection('partners').doc(partnerId).update({ last_post: image })
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
        console.log('get error', err)
      })
  }
}

export const searchPartnerByName = (dispatch, name, loadingAction, receiveAction) => {
  // FIXME: Foi filtrado no reducer até criar fullsearchtext no firebase

  dispatch(loadingAction(true))

  db.collection('partners')
    .get()
    .then(snapshot => {
      dispatch(loadingAction(false))
      let docs = convertSnapshot(snapshot)
      dispatch(receiveAction(docs, { name: name }))
    })
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
  }).catch(err => {
    console.log('search error ', err)
  })
}

// @todo Refator to batch
export const add = function (resource, data, dispatch, receiveAction, errorAction, loadingAction) {
  docRef = db.collection(resource)
  data = Array.isArray(data) ? data : [data]
  let countTerminated = 0

  if (typeof loadingAction === 'function') {
    dispatch(loadingAction(true))
  }

  data.forEach(item => {
    item['created_at'] = currentTime()
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

export const partnerLogin = (pass, dispatch, loadingAction, redirectToAccount, invalidPass) => {
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
      } else {
        dispatch(redirectToAccount(false))
        dispatch(invalidPass(true))
      }
      dispatch(loadingAction(false))
    }).catch(err => {
      console.log('partnerLogin error ', err)
    })
}

export const userLogin = (user, dispatch, loadingAction, loginSuccessAction, redirectToChat) => {
  dispatch(loadingAction(true))

  return db.collection('users')
    .where('phone', '==', user.phone)
    .get()
    .then(snapshot => {
      let docs = snapshot.docs
      if (docs.length >= 1) {
        let user = docs[0].data()
        user.id = docs[0].id
        dispatch(loginSuccessAction(docs[0].data()))
        dispatch(redirectToChat(true))
      } else {
        // FIXME: Confirmar antes de cadastrar o usuário
        db.collection('users').add(user)
          .then(snapshot => {
            user.id = snapshot.id
            dispatch(loginSuccessAction(user))
            dispatch(redirectToChat(true))
          })
      }
    }).catch(err => {
      console.log('userLogin error ', err)
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
    }).catch(err => {
      console.log('partnerUpdateFbAcessToken error ', err)
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
    }).catch(err => {
      console.log('checkIsPartner error ', err)
    })
}

export const createChatIfNotExists = (dispatch, partner, user) => {
  return db.collection('chats')
    .where('partner_id', '==', partner.id)
    .where('user_id', '==', user.id)
    .get()
    .then(snapshot => {
      if (snapshot.docs.length === 0) {
        db.collection('chats').add({
          partner_id: partner.id,
          user_id: user.id,
          unread: 0,
          time: firebase.firestore.FieldValue.serverTimestamp(),
          user_name: user.name,
          partner_name: partner.name,
          partner_avatar: partner.logo,
        })
      }
    }).catch(err => {
      console.log('createChatIfNotExists error ', err)
    })
}

const currentTime = () => firebase.firestore.FieldValue.serverTimestamp()

const requestError = error => {
  if (__DEV__)
    throw error
}