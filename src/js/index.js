import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { store } from 'state'
import App from 'App'
// import { setStatusLoading } from 'state'

import '../sass/main.sass'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)

// store.dispatch(setStatusLoading('hi'))
