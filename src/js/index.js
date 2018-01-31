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
import { unique } from 'utils'

getCommentIDs('TwoXChromosomes', '6z1hch')
  .then(ids => console.log(unique(ids)))
