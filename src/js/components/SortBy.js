import React from 'react'

export default props => (
  <div id='comment-sort'>
  sorted by:
    <span className='space' />
    <select>
      <option value='top'>top</option>
      <option value='bottom'>bottom</option>
      <option value='new'>new</option>
      <option value='old'>old</option>
    </select>
    <span className='space' />
  show:
    <span className='space' />
    <select>
      <option value='all'>All comments</option>
      <option value='removed-deleted'>Removed and deleted</option>
      <option value='removed'>Removed</option>
      <option value='deleted'>Deleted</option>
    </select>
  </div>
)
