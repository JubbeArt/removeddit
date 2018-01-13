import { createStore, combineReducers, applyMiddleware } from 'redux'
import logger from 'redux-logger'

import { statusReducer } from './status'
export { setStatusLoading, setStatusSuccess, setStatusError } from './status'

const reducer = combineReducers({
	status: statusReducer
})



export const store = createStore(reducer, applyMiddleware(logger))