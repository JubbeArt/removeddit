import React from 'react'
import Comment from 'components/Comment'
import CommentInfo from 'components/CommentInfo'
import SortBy from 'components/SortBy'
import { topSort, bottomSort, newSort, oldSort } from 'utils'


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
      lookup[parentID].replies.push(comment)
    }
  })

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

const commentSection = (props) => {
  const commentTree = unflatten(props.comments, props.root, props.removed, props.deleted)
  sortCommentTree(commentTree, newSort)// props.comments.sort(topSort)


  console.log('COMMENT SECTION RENDERED')
  console.log(props.root)
  console.log(commentTree)
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


export default commentSection
