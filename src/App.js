import React from 'react'
import {
  BrowserRouter,
  Switch,
  Route
} from 'react-router-dom'

import Header from 'components/Header'
import { About, Thread, Subreddit } from 'pages'

export default () => (
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
)
