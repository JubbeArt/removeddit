import { chunk, flatten } from '../../utils'
import { getAuth } from './auth'

const errorHandler = () => {
  throw new Error('Could not connect to Reddit')
}

// Thread = Post + Comments
// Return the post itself
export const getPost = (subreddit, threadID) => (
  getAuth()
    .then(auth => window.fetch(`https://oauth.reddit.com/r/${subreddit}/comments/${threadID}/_/`, auth))
    .then(response => response.json())
    .then(thread => thread[0].data.children[0].data)
    .catch(errorHandler)
)

// Fetch multiple threads (via the info endpoint)
export const getThreads = threadIDs => {
  return getAuth()
    .then(auth => window.fetch(`https://oauth.reddit.com/api/info?id=${threadIDs.map(id => `t3_${id}`).join()}`, auth))
    .then(response => response.json())
    .then(response => response.data.children.map(threadData => threadData.data))
    .catch(errorHandler)
}

// Helper function that fetches a list of comments
const fetchComments = (commentIDs, auth) => {
  return window.fetch(`https://oauth.reddit.com/api/info?id=${commentIDs.map(id => `t1_${id}`).join()}`, auth)
    .then(response => response.json())
    .then(results => results.data.children)
    .then(commentsData => commentsData.map(commentData => commentData.data))
}

export const getComments = commentIDs => {
  return getAuth()
    .then(auth => (
      Promise.all(chunk(commentIDs, 100)
        .map(ids => fetchComments(ids, auth)))
        .then(flatten)
    ))
    .catch(errorHandler)
}
