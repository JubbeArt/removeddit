import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { store } from 'state'
import App from 'App'
// import { setStatusLoading } from 'state'

import '../sass/main.sass'

// ReactDOM.render(
//   <Provider store={store}>
//     <App />
//   </Provider>,
//   document.getElementById('app')
// )
import { getComments } from 'api/reddit'
import { getComments as getAllComments } from 'api/pushshift'

getAllComments('6z1hch')
  // .then(comments => comments.filter((val, i) => i < 100))
  .then(comments => {
    const ids = comments.map(comment => comment.id)
    // push to state
    return getComments(ids)
  })
//
// .then(getComments)
  .then(redditComments => {
    const removed = []
    const deleted = []

    redditComments.forEach(comment => {
      if (comment.body === '[removed]') {
        removed.push(comment.id)
      } else if (comment.body === '[deleted]') {
        deleted.push(comment.id)
      }
    })

    console.log('deleted', deleted)
    console.log('removed', removed)
  })

