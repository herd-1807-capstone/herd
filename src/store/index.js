import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension';

import user from '../reducers/user'
import spots from '../reducers/spots'

const reducer = combineReducers({
  user,
  spots,
})
const middleware = applyMiddleware(thunkMiddleware)

const store = createStore(reducer, composeWithDevTools(middleware))

export default store
export * from '../reducers/user'
export * from '../reducers/spots'
