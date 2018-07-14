import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import { store } from './state'

import Header from './pages/common/Header'
import About from './pages/about'
import Subreddit from './pages/subreddit'
import Thread from './pages/thread'

ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter basename={__dirname}>
      <React.Fragment>
        <Header />
        <div className='main'>
          <Switch>
            <Route exact path='/' component={Subreddit} />
            <Route path='/about' component={About} />
            <Route path='/r/:subreddit/comments/:threadID/:junk/:commentID' component={Thread} />
            <Route path='/r/:subreddit/comments/:threadID' component={Thread} />
            <Route path='/r/:subreddit' component={Subreddit} />
          </Switch>
        </div>
      </React.Fragment>
    </BrowserRouter>
  </Provider>,
  document.getElementById('app')
)
