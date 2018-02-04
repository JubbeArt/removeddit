import { createStore, combineReducers, applyMiddleware } from 'redux'
import logger from 'redux-logger'
import { statusReducer } from './status'
import { commentSectionReducer } from './commentSection'

export { setStatusLoading, setStatusSuccess, setStatusError } from './status'
export * from './commentSection'

const reducer = combineReducers({
  status: statusReducer,
  commentSection: commentSectionReducer,
})

export const store = createStore(reducer, applyMiddleware(logger))
