const baseURL = 'https://removeddit.com/api'

export const getRemovedThreadIDs = (subreddit = '', page = 1) => {
  if (subreddit.toLowerCase() === 'all') {
    subreddit = ''
  }

  return window.fetch(`${baseURL}/threads?subreddit=${subreddit}&page=${page - 1}`)
    .then(response => response.json())
    .catch(() => { throw new Error('Could not get removed threads') })
}
