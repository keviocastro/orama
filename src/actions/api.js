import Config from 'react-native-config';

const search = (resource, dispatch, receiveAction, initRequestAction, errorAction, filter = []) => {
  dispatch(initRequestAction());
  let queryFilter = '';

  if (Object.keys(filter).length > 0) {
    queryFilter = `?${filter.field}_like=${filter.value}`;
  }
  const url = `${Config.API_URL}/${resource}${queryFilter}`;

  return fetch(url)
    .then((response) => {
      if (!response.ok) dispatch(errorAction(`Request error with status ${response.status}`));
      return response.json();
    })
    .then((result) => {
      dispatch(receiveAction(result, filter));
    });
};

export default search;
