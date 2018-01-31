import React from 'react'
import {
  BrowserRouter,
  Switch,
  Route,
} from 'react-router-dom'

import Header from 'components/Header'
import { About, Thread, Subreddit } from 'pages'

export default props => (
  <BrowserRouter basename={__dirname}>
    <React.Fragment>
      <Header status={props.status} />
      <div className='main'>
        <Switch>
          <Route exact path='/' component={About} />
          <Route path='/about' component={About} />
          <Route path='/r/:subreddit/comments/:threadID' component={Thread} />
          <Route path='/r/:subreddit/comments/:threadID/:junk/:commentID' component={Thread} />
        </Switch>
      </div>
    </React.Fragment>
  </BrowserRouter>
)

