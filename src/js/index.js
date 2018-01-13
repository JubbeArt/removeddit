import '../sass/main.sass'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { store } from 'state'
import App from './App'

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>, 
	document.getElementById("app")
)

// console.log(store.getState())

import {setStatusError} from 'state'
// store.subscribe(() => console.log(store.getState()))

 store.dispatch(setStatusError('Hello world'))
  store.dispatch(setStatusError('Hi again :)'))


// import {json} from 'utils'
// import {test} from 'pushshift'
// test('7q2k2g').then(console.log)