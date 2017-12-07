import { StackNav } from './../components/Navigator';

const initialState = StackNav.router.getStateForAction(StackNav.router.getActionForPathAndParams('Home'));

export default (state = initialState, action) => {
  const nextState = StackNav.router.getStateForAction(action, state);
  return nextState || state;
};
