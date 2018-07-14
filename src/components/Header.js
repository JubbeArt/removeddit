import React from 'react'
import { Link } from 'react-router-dom'
import StatusBox from 'containers/StatusBox'

export default () => (
  <header>
    <div id='header'>
      <h1>
        <Link to='/'>Removeddit</Link>
      </h1>
      <nav>
        <Link to='/r/all'>/r/all</Link>
        <Link to='/about/'>about</Link>
      </nav>
    </div>
    <StatusBox />
  </header>
)
