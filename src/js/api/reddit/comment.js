import { fetchMultiple, jsonMultiple, unique } from 'utils'
import { getAuth } from './auth'
import { getThread } from './thread'

export const commentLookup = {}

export const getCommentIDs = (
  subreddit,
  threadID,
  commentID = '',
  results = { // This is ugly i know...
    ids: [],
    continueThisThreadIDs: {},
    morechildrenIDs: {},
  }
) => (
  getComments(subreddit, threadID, commentID)
    .then(comments => handleComments(comments, subreddit, threadID, commentID, results))
    .then(() => debug(results))
    .then(() => unique(results.ids))
)

const getComments = (subreddit, threadID, commentID) => (
  getThread(subreddit, threadID, commentID)
    .then(thread => thread[1].data.children)
)

const handleComments = (comments, subreddit, threadID, commentID, results) => {
  // Init ID arrays for this thread of comments ()
  results.continueThisThreadIDs[commentID] = []
  results.morechildrenIDs[commentID] = []

  comments.forEach(comment => handleComment(comment, commentID, results))

  return (
    handleMoreChildren(threadID, commentID, results)
      .then(() => (
        Promise.all(results.continueThisThreadIDs[commentID].map(id =>
          getCommentIDs(subreddit, threadID, id, results)))
      ))
  )
}

const handleComment = (comment, commentID, results) => {
  // Normal comment
  if (comment.kind === 't1') {
    // Has comment replies
    if (comment.data.replies) {
      // Handle all replies in the same way
      comment.data.replies.data.children.forEach(commentReply => handleComment(commentReply, commentID, results))
      delete comment.data.replies
    }

    // Add to the return object
    results.ids.push(comment.data.id)
    // Store commment in lookup table
    commentLookup[comment.data.id] = comment.data

  // Special comment
  } else if (comment.kind === 'more') {
    // "continue this thread" comment
    if (comment.data.id === '_') {
      results.continueThisThreadIDs[commentID].push(comment.data.parent_id.split('_')[1])

    // "Load more"-comment (that is missing some of its children)
    } else if (comment.data.children.length < comment.data.count) {
      results.morechildrenIDs[commentID].push(comment.data.children)
    }

    // Always add the "more"-comments children
    results.ids.push(...comment.data.children)
  }
}

const handleMoreChildren = (threadID, commentID, results) => (
  getAuth()
    .then(auth => (
      Promise.all(results.morechildrenIDs[commentID].map(idArray =>
        fetchMultiple(`https://oauth.reddit.com/api/morechildren?link_id=t3_${threadID}&children=`, idArray, auth)))
        .then(responsesArrays => Promise.all(responsesArrays.map(jsonMultiple)))
        .then(responsesArrays => {
          // Reset the array and parse for new morechildren-comments
          results.morechildrenIDs[commentID] = []
          responsesArrays.forEach(responses => responses.forEach(response => response.jquery[10][3][0].forEach(comment => {
            handleComment(comment, commentID, results)
          })))
        })
        .then(() => {
          if (results.morechildrenIDs[commentID].length !== 0) {
            return handleMoreChildren(threadID, commentID, results)
          }

          return Promise.resolve()
        })
    ))
)

const debug = results => {
  console.log(JSON.parse(JSON.stringify(results)))
}
