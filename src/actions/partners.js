import search from './api';

export const PARTNERS_RECEIVED = 'PARTNERS_RECEIVED';
export const received = (partners, filter) => ({
  type: PARTNERS_RECEIVED,
  partners,
  segmentId: filter.value,
});

export const PARTNERS_REQUEST = 'PARTNERS_REQUEST';
export const request = filter => ({
  type: PARTNERS_REQUEST,
  segmentId: filter.value,
});

export const PARTNERS_REQUEST_ERROR = 'PARTNERS_REQUEST_ERROR';
export const requestError = error => ({
  type: PARTNERS_REQUEST_ERROR,
  error,
});

export const getPartners = segmentId => dispatch =>
  search('partners', dispatch, received, request, requestError, {
    field: 'segmentIds',
    value: segmentId,
  });

export const PARTNERS_SELECT = 'PARTNERS_SELECT';
export const selectPartner = partner => ({
  type: PARTNERS_SELECT,
  partner,
});
