import React from 'react'
import {connect, sort, filter} from '../../state'

const sortBy = props => (
  <div id='comment-sort'>
  sorted by:
    <span className='space' />
    <select onChange={e => props.global.setCommentSort(e.target.value)} defaultValue={props.global.state.commentSort}>
      <option value={sort.top}>top</option>
      <option value={sort.bottom}>bottom</option>
      <option value={sort.new}>new</option>
      <option value={sort.old}>old</option>
    </select>
    <span className='space' />
  show:
    <span className='space' />
    <select onChange={e => props.global.setCommentFilter(e.target.value)} defaultValue={props.global.state.commentFilter}>
      <option value={filter.all}>All comments</option>
      <option value={filter.removedDeleted}>Removed and deleted</option>
      <option value={filter.removed}>Removed</option>
      <option value={filter.deleted}>Deleted</option>
    </select>
  </div>
)

export default connect(sortBy)
