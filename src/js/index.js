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

// import {setStatusLoading} from 'state'
// store.dispatch(setStatusLoading('hi'))

// import { getThread } from 'reddit'
// getThread('videos', '7q4vxi')