import React from 'react'

const getProcent = (part, total) => (total === 0 ? '0.0' : ((100 * part) / total).toFixed(1))

export default props => (
  <div id='comment-info'>
    <span className='removed-text'>
      removed comments: {props.removed}/{props.total} ({getProcent(props.removed, props.total)}%)
    </span>
    <br />
    <span className='deleted-text'>
      deleted comments:  {props.deleted}/{props.total} ({getProcent(props.deleted, props.total)}%)
    </span>
  </div>
)
