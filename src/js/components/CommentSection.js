import React from 'react'
import Comment from 'components/Comment'
import CommentInfo from 'components/CommentInfo'
import SortBy from 'components/SortBy'
import { connect } from 'react-redux'
import {
  SORT_TOP, SORT_BOTTOM, SORT_NEW, SORT_OLD,
  SHOW_ALL, SHOW_REMOVED_DELETED, SHOW_REMOVED, SHOW_DELETED,
} from 'state'
import {
  topSort, bottomSort, newSort, oldSort,
  showRemovedAndDeleted, showRemoved, showDeleted,
} from 'utils'

const arrayToLookup = (commentList, removed, deleted) => {
  const lookup = {}

  commentList.forEach(comment => {
    comment.replies = []

    if (removed.includes(comment.id)) {
      comment.removed = true
    } else if (deleted.includes(comment.id)) {
      comment.deleted = true
    }

    lookup[comment.id] = comment
  })

  return lookup
}

const unflatten = (comments, root, removed, deleted) => {
  const lookup = arrayToLookup(comments, removed, deleted)
  const commentTree = []

  Object.keys(lookup).forEach(commentID => {
    const comment = lookup[commentID]
    const parentID = comment.parent_id

    if (parentID === root) {
      commentTree.push(comment)
    } else {
      if (lookup[parentID] === undefined) {
        console.error('MISSING PARENT ID:', parentID, 'for comment', comment)
        return
      }

      lookup[parentID].replies.push(comment)
    }
  })

  if (lookup[root] !== undefined) {
    lookup[root].replies = commentTree
    return [lookup[root]]
  }

  return commentTree
}

const sortCommentTree = (comments, sortFunction) => {
  comments.sort(sortFunction)

  comments.forEach(comment => {
    if (comment.replies.length > 0) {
      sortCommentTree(comment.replies, sortFunction)
    }
  })
}

const filterCommentTree = (comments, filterFunction) => {
  if (comments.length === 0) {
    return false
  }

  let hasOkComment = false

  // Reverse for loop since we are removing stuff
  for (let i = comments.length - 1; i >= 0; i--) {
    const comment = comments[i]
    const isRepliesOk = filterCommentTree(comment.replies, filterFunction)
    const isCommentOk = filterFunction(comment)

    if (!isRepliesOk && !isCommentOk) {
      comments.splice(i, 1)
    } else {
      hasOkComment = true
    }
  }

  return hasOkComment
}

const commentSection = (props) => {
  console.time('render comment section')
  const commentTree = unflatten(props.comments, props.root, props.removed, props.deleted)

  if (props.show === SHOW_REMOVED_DELETED) {
    filterCommentTree(commentTree, showRemovedAndDeleted)
  } else if (props.show === SHOW_REMOVED) {
    filterCommentTree(commentTree, showRemoved)
  } else if (props.show === SHOW_DELETED) {
    filterCommentTree(commentTree, showDeleted)
  }

  if (props.sort === SORT_TOP) {
    sortCommentTree(commentTree, topSort)
  } else if (props.sort === SORT_BOTTOM) {
    sortCommentTree(commentTree, bottomSort)
  } else if (props.sort === SORT_NEW) {
    sortCommentTree(commentTree, newSort)
  } else if (props.sort === SORT_OLD) {
    sortCommentTree(commentTree, oldSort)
  }
  console.timeEnd('render comment section')

  return (
    <div>
      <CommentInfo
        total={props.comments.length}
        removed={props.removed.length}
        deleted={props.deleted.length}
      />
      <SortBy />
      {commentTree.map(comment => (
        <Comment
          key={comment.id}
          {...comment}
        />
      ))}
    </div>
  )
}

const mapStateToProps = state => ({
  sort: state.commentSection.sort,
  show: state.commentSection.show,
})


export default connect(mapStateToProps)(commentSection)
