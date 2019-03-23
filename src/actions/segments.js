import { get } from './api';

export const SEGMENTS_RECEIVED = 'SEGMENTS_RECEIVED';
export const received = segments => ({
  type: SEGMENTS_RECEIVED,
  segments,
});

export const SEGMENTS_LOADING = 'SEGMENTS_LOADING';
export const loading = (loading) => ({
  type: SEGMENTS_LOADING,
  loading
});

export const getSegments = () => dispatch =>
  get('segments', {}, { 'priority': 'asc' }, dispatch, false, loading, received)
