import { NavigationActions } from 'react-navigation';
import { Navigator } from './../components/Navigator';

const initialState = Navigator.router.getStateForAction(NavigationActions.init());

export default (state = initialState, action) => {
  const nextState = Navigator.router.getStateForAction(action, state);
  return nextState || state;
};
