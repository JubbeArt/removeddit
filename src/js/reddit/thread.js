import { json } from 'utils'
import { fetchToken, redditAuth } from 'reddit/token'

const cachedThreads = {}

export const getThread = (subreddit, threadID, continueThisThreadID = '') => {
  // We have already downloaded the thread and can use a cached copy
  if (cachedThreads.hasOwnProperty(threadID)) {
    if (cachedThreads[threadID].hasOwnProperty(continueThisThreadID)) {
      return Promise.resolve(cachedThreads[threadID][continueThisThreadID])
    }
  }

  const url = `https://oauth.reddit.com/r/${subreddit}/comments/${threadID}/_/${continueThisThreadID}`
  // Fetch thread from reddit
  return (
    fetchToken()
      .then(() => fetch(url, redditAuth))
      .then(json)
      .then(thread => {
        // Save the thread for later
        if (!cachedThreads.hasOwnProperty(threadID)) {
          cachedThreads[threadID] = {}
        }

        cachedThreads[threadID][continueThisThreadID] = thread

        // Return the thread
        return thread
      })
  )
}

// Thread = Post + Comments
// Return the post itself
export const extractPost = thread => thread[0].data.children[0].data
