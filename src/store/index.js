import { createStore, combineReducers, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';

import user from '../reducers/user';
import spots from '../reducers/spots';
import chat from '../reducers/chat';

const reducer = combineReducers({
  user,
  spots,
  chat,
});
const middleware = applyMiddleware(thunkMiddleware);

const store = createStore(reducer, composeWithDevTools(middleware));

export default store
export * from '../reducers/user'
export * from '../reducers/spots'
export * from '../reducers/announcement'
