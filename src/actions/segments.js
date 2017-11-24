import Config from 'react-native-config';

export const RECEIVE_SEGMENTS = 'RETRIEVE_SEGMENTS';
export const receiveSegments = segments => ({
  type: RECEIVE_SEGMENTS,
  segments,
});

export const REQUEST_SEGMENTS = 'REQUEST_SEGMENTS';
export const requestSegments = () => ({
  type: REQUEST_SEGMENTS,
});

export const REQUEST_ERROR = 'REQUEST_ERROR';
export const requestError = error => ({
  type: REQUEST_ERROR,
  error,
});

export const getSegments = () => (dispatch) => {
  dispatch(requestSegments());
  return fetch(`${Config.API_URL}/segments`)
    .then((response) => {
      if (!response.ok) dispatch(requestError(`Request error with status ${response.status}`));
      return response.json();
    })
    .then((result) => {
      dispatch(receiveSegments(result));
    })
    .catch((error) => {
      // TODO: how to dispatch error
    });
};
