import React from 'react'

export default props => (
  <div id='comment-info'>
    <span className='removed-text'>
      removed comments: {props.removed}/{props.total} ({((100 * props.removed) / props.total).toFixed(1)}%)
    </span>
    <br />
    <span className='deleted-text'>
      deleted comments:  {props.deleted}/{props.total} ({((100 * props.deleted) / props.total).toFixed(1)}%)
    </span>
  </div>
)
