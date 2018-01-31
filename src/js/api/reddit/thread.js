import { json } from 'utils'
import { getAuth } from './auth'

const cachedThreads = {}

// Thread = Post + Comments
// Return the post itself
export const getPost = (subreddit, threadID) => (
  getThread(subreddit, threadID)
    .then(thread => thread[0].data.children[0].data)
)

export const getThread = (subreddit, threadID, commentID = '') => {
  // We have already downloaded the thread and can use a cached copy
  if (cachedThreads.hasOwnProperty(threadID)) {
    if (cachedThreads[threadID].hasOwnProperty(commentID)) {
      return Promise.resolve(cachedThreads[threadID][commentID])
    }
  }

  const url = `https://oauth.reddit.com/r/${subreddit}/comments/${threadID}/_/${commentID}`
  // Fetch thread from reddit
  return (
    getAuth()
      .then(auth => fetch(url, auth))
      .then(json)
      .then(thread => {
        // Create cache object for thread  if it doesn't exists
        if (!cachedThreads.hasOwnProperty(threadID)) {
          cachedThreads[threadID] = {}
        }

        // Save the thread for later
        cachedThreads[threadID][commentID] = thread

        // Return the thread
        return thread
      })
  )
}
