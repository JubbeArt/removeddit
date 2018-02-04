import React from 'react'
import {
  setCommentSort,
  setCommentShow,
  SORT_TOP, SORT_BOTTOM, SORT_NEW, SORT_OLD,
  SHOW_ALL, SHOW_REMOVED_DELETED, SHOW_REMOVED, SHOW_DELETED,
} from 'state'
import { connect } from 'react-redux'

const sortBy = props => (
  <div id='comment-sort'>
  sorted by:
    <span className='space' />
    <select onChange={e => props.setSort(e.target.value)}>
      <option value={SORT_TOP}>top</option>
      <option value={SORT_BOTTOM}>bottom</option>
      <option value={SORT_NEW}>new</option>
      <option value={SORT_OLD}>old</option>
    </select>
    <span className='space' />
  show:
    <span className='space' />
    <select onChange={e => props.setShow(e.target.value)}>
      <option value={SHOW_ALL}>All comments</option>
      <option value={SHOW_REMOVED_DELETED}>Removed and deleted</option>
      <option value={SHOW_REMOVED}>Removed</option>
      <option value={SHOW_DELETED}>Deleted</option>
    </select>
  </div>
)

const mapStateToProps = state => ({
  sort: state.commentSection.sort,
  show: state.commentSection.show,
})

const mapDispatchToProps = dispatch => ({
  setSort: sortString => dispatch(setCommentSort(sortString)),
  setShow: showString => dispatch(setCommentShow(showString)),
})

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(sortBy)

