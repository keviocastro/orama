export const FIREBASE_ERROR = 'FIREBASE_ERROR'
export const firebaseError = (error) => ({
  type: FIREBASE_ERROR,
  error
})