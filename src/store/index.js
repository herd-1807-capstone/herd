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

<<<<<<< HEAD
export default store
export * from '../reducers/user'
export * from '../reducers/spots'
export * from '../reducers/announcement'
=======
export default store;
export * from '../reducers/user';
export * from '../reducers/spots';
>>>>>>> 0d9f841318c0a2a599003f1899502649d5366eb5
