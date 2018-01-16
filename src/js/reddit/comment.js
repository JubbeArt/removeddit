import { json, fetchMultiple, jsonMultiple, unique } from 'utils'
import { redditAuth } from 'reddit/token'
import { getThread, extractPost } from './thread'

export const commentLookup = {}

const handleThreadComment = (comment, results) => {
  if (comment.kind === 't1') {
    // Has comment replies
    if (comment.data.replies) {
      // Handle all replies in the same way
      comment.data.replies.data.children.forEach(reply => handleThreadComment(reply, results))
      delete comment.data.replies
    }

    // Add to the return object
    results.ids.push(comment.data.id)
    // Store commment in lookup table
    commentLookup[comment.data.id] = comment.data
  } else if (comment.kind === 'more') {
    if (comment.data.id === '_') {
      // "continue this thread" comment
      results.continueThisThreadIDs.push(comment.data.parent_id);
    } else if (comment.data.children.length < comment.data.count) {
      // "Load more"-comment (that is missing some of its children)
      results.morechildrenIDs.push(comment.data.children)
    }

    // Always add the "more"-comments children
    results.ids.push(...comment.data.children)
  } else {
    console.error('WTF', comment.kind)
  }

  return results
}

const handleMoreChildren = (results, threadID) => (
  Promise.all(results.morechildrenIDs.map(idArray =>
    fetchMultiple(`https://oauth.reddit.com/api/morechildren?link_id=t3_${threadID}&children=`, idArray, redditAuth)))
    .then(responsesArrays => Promise.all(responsesArrays.map(jsonMultiple)))
    .then(responsesArrays => {
      // Reset the array and parse for new morechildren-comments
      results.morechildrenIDs = []
      responsesArrays.forEach(responses => responses.forEach(response => response.jquery[10][3][0].forEach(comment => {
        handleThreadComment(comment, results)
      })))
    })
    .then(() => {
      if (results.morechildrenIDs.length !== 0) {
        return handleMoreChildren(results, threadID)
      }

      return Promise.resolve()
    })
)

const extractComments = thread => thread[1].data.children

const debug = res => {
  console.log('IDs:', res.ids)
  console.log('Continue:', res.continueThisThreadIDs)
  console.log('Morechildren:', res.morechildrenIDs)
}

const handleThread = thread => {
  const comments = extractComments(thread)

  // Ugly "hack", using this object as a pointer for storing comments.
  // Not very js-like
  const results = {
    ids: [],
    continueThisThreadIDs: [],
    morechildrenIDs: [],
  }

  comments.map(comment => handleThreadComment(comment, results))
  const { subreddit, id: threadID } = extractPost(thread)

  return Promise.all([
    ...results.continueThisThreadIDs.map(id => getThread(subreddit, threadID, id)
      .then(subthread => handleThread(subthread))),
    handleMoreChildren(results, threadID),
  ])
    .then(resultsArray => {
    // Removed handleMoreChildren element
    // This will result in resultsArray containing a list of comments
    // from all 'continue this thread' posts
      console.log(resultsArray)
      resultsArray.pop()
      console.log(results)
      console.log(resultsArray)
    })
  // zip
  // )
  // .then(
  //   return results
  // )
}


export const getCommentIDs = (subreddit, threadID) => (
  getThread(subreddit, threadID)
    .then(thread => handleThread(thread))
)
