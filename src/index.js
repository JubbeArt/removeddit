import 'babel-polyfill'
import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Provider } from 'unstated'

import Header from './pages/common/Header'
import About from './pages/about'
import Subreddit from './pages/subreddit'
import Thread from './pages/thread'
import NotFound from './pages/notFound'

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
            <Route component={NotFound} />
          </Switch>
        </div>
      </React.Fragment>
    </BrowserRouter>
  </Provider>,
  document.getElementById('app')
)
