const baseURL = 'https://removeddit.com/api'

export const getRemovedThreadIDs = (subreddit = '', page = 1) => (
  fetch(`${baseURL}/threads?subreddit=${subreddit}&page=${page - 1}`)
    .then(response => response.json())
)
