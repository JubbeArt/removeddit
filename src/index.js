import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import { Provider } from 'unstated'

import Header from './pages/common/Header'
import About from './pages/about'
import Subreddit from './pages/subreddit'
import Thread from './pages/thread'
import NotFound from './pages/404'

ReactDOM.render(
  <Provider>
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
            <Redirect from='/user/:username/comments/:threadID/:junk/:commentID'
                      to='/r/u_username/comments/:threadID/:junk/:commentID' />
            <Redirect from='/user/:username/comments/:threadID' to='/r/u_:username/comments/:threadID' />
            <Redirect from='/user/:username' to='/r/u_:username' />
            <Route component={NotFound} />
          </Switch>
        </div>
      </React.Fragment>
    </BrowserRouter>
  </Provider>,
  document.getElementById('app')
)
