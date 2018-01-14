import React from 'react'
import {
  BrowserRouter,
  Switch,
  Route,
} from 'react-router-dom'

import Menu from 'components/Menu'
import { About, Thread, Subreddit } from 'pages'

export default props => (
  <BrowserRouter basename={__dirname}>
    <>
      <Menu status={props.status} />
      <div className='main'>
        <Switch>
          <Route exact path='/' component={About} />
          <Route path='/about' component={About} />
          <Route path='/r/:subreddit/comments/:threadID' component={Thread} />
        </Switch>
      </div>
    </>
  </BrowserRouter>
)

