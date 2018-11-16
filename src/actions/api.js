import { API_URL } from './../config'

const search = (resource, dispatch, receiveAction, initRequestAction, errorAction, filter = []) => {
  dispatch(initRequestAction(filter))
  let query = ''

  if (Object.keys(filter).length > 0) {
    query = `?${filter.field}_like=${filter.value}&_sort=priority,name`
  } else {
    query = `?_sort=priority,name`
  }

  const url = `${API_URL}/${resource}${query}`

  return fetch(url)
    .then((response) => {
      if (!response.ok) dispatch(errorAction(`Request error with status ${response.status}`))
      return response.json()
    })
    .then((result) => {
      dispatch(receiveAction(result, filter))
    })
    .catch((err) => {
      if (__DEV__) {
        throw err
      } else {
        //@todo tratar erro e exibir mensagem pro usuáio
      }
    })
}

export default search
