import { get } from './api';

export const SEGMENTS_RECEIVED = 'SEGMENTS_RECEIVED';
export const received = segments => ({
  type: SEGMENTS_RECEIVED,
  segments,
});

export const SEGMENTS_REQUEST = 'SEGMENTS_REQUEST';
export const request = () => ({
  type: SEGMENTS_REQUEST,
});

export const SEGMENTS_REQUEST_ERROR = 'SEGMENTS_REQUEST_ERROR';
export const requestError = error => ({
  type: SEGMENTS_REQUEST_ERROR,
  error,
});

export const getSegments = () => dispatch =>
  get('segments', {}, { 'priority': 'asc' }, dispatch, false, request, received)
