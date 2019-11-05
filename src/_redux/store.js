
import { createStore, combineReducers, applyMiddleware } from 'redux';
import { logger, promise } from './middleware'

import sketch from '../_reducers/sketch'
import favorite from '../_reducers/fav'
import user from '../_reducers/user'

const reducers = combineReducers({
  sketch,
  favorite,
  user
})
  
const store = createStore(
  reducers,
  applyMiddleware(logger, promise));

export default store

