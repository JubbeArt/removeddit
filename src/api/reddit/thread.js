import { getAuth } from './auth'

// Thread = Post + Comments
// Return the post itself
export const getPost = (subreddit, threadID) => (
  getAuth()
    .then(auth => window.fetch(`https://oauth.reddit.com/r/${subreddit}/comments/${threadID}/_/`, auth))
    .then(response => response.json())
    .then(thread => thread[0].data.children[0].data)
)

// Fetch multiple threads (via the info endpoint)
export const getThreads = threadIDs => {
  return getAuth()
    .then(auth => window.fetch(`https://oauth.reddit.com/api/info?id=${threadIDs.map(id => `t3_${id}`).join()}`, auth))
    .then(response => response.json())
    .then(response => response.data.children.map(threadData => threadData.data))
}
