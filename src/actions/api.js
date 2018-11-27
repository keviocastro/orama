import { ORAMA_URL } from '../config/api';

const search = (resource, dispatch, receiveAction, initRequestAction, errorAction, filter = []) => {
  dispatch(initRequestAction(filter));
  let queryFilter = '';

  if (Object.keys(filter).length > 0) {
    queryFilter = `?${filter.field}_like=${filter.value}`;
  }
  const url = `${ORAMA_URL}/${resource}${queryFilter}`;

  return fetch(url)
    .then((response) => {
      if (!response.ok) dispatch(errorAction(`Request error with status ${response.status}`));
      return response.json();
    })
    .then((result) => {
      dispatch(receiveAction(result, filter));
    })
    .catch((err) => {
      // TODO: register error
      console.log('Error api search: ', err);
    });
};

export default search;
