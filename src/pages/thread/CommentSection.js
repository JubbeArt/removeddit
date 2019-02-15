import React, { useState } from 'react'
import Comment from './Comment'
import {connect, sort, filter} from '../../state'
import {
  topSort, bottomSort, newSort, oldSort,
  showRemovedAndDeleted, showRemoved, showDeleted
} from '../../utils'

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
  const [activeComment, setActiveComment] = useState('')
  const commentTree = unflatten(props.comments, props.root, props.removed, props.deleted)
  const {commentFilter, commentSort} = props.global.state

  if (commentFilter === filter.removedDeleted) {
    filterCommentTree(commentTree, showRemovedAndDeleted)
  } else if (commentFilter === filter.removed) {
    filterCommentTree(commentTree, showRemoved)
  } else if (commentFilter === filter.deleted) {
    filterCommentTree(commentTree, showDeleted)
  }

  if (commentSort === sort.top) {
    sortCommentTree(commentTree, topSort)
  } else if (commentSort === sort.bottom) {
    sortCommentTree(commentTree, bottomSort)
  } else if (commentSort === sort.new) {
    sortCommentTree(commentTree, newSort)
  } else if (commentSort === sort.old) {
    sortCommentTree(commentTree, oldSort)
  }
  console.timeEnd('render comment section')

  return (
    commentTree.length !== 0
      ? commentTree.map(comment => (
        <Comment
          key={comment.id}
          {...comment}
          depth={0}
          activeComment={activeComment}
          setActiveComment={setActiveComment}
        />
      ))
      : <p>No comments found</p>
  )
}

export default connect(commentSection)
