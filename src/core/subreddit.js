import { getRemovedThreadIDs } from '../api/removeddit'
import { getThreads } from '../api/reddit'

export default (subreddit = 'all', setState) => {
  subreddit = subreddit.toLowerCase() === 'all' ? '' : subreddit.toLowerCase()

  getRemovedThreadIDs(subreddit)
    .then(threadIDs => getThreads(threadIDs))
    .then(threads => {
      threads.forEach(thread => {
        thread.removed = true
        thread.selftext = ''
      })
      setState({ threads })
    })
}
