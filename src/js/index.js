// import React from 'react'
// import ReactDOM from 'react-dom'
// import { Provider } from 'react-redux'
// import { store } from 'state'
// import App from 'App'
// // import { setStatusLoading } from 'state'

// import '../sass/main.sass'

// ReactDOM.render(
//   <Provider store={store}>
//     <App />
//   </Provider>,
//   document.getElementById('app')
// )

// store.dispatch(setStatusLoading('hi'))

import { getCommentIDs } from 'api/reddit'
import { getCommentIDs as getAllCommentIDs } from 'api/pushshift'

import { difference } from './utils/index'


Promise.all([
  getAllCommentIDs('6z1hch'),
  getCommentIDs('TwoXChromosomes', '6z1hch'),
])
  .then(resp => console.log(resp[1].length, difference(resp[0], resp[1])))


// getCommentIDs('6z1hch')

// getThread('6z1hch').then(console.log)
// getComments(['dmt88s6', 'dmtqxj8', 'dmt1euz']).then(console.log)
// .then(ids => console.log(unique(ids)))
