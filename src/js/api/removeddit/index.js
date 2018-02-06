import { json } from 'utils'

const baseURL = 'http://localhost:9000/api'

export const getRemovedThreadIDs = (subreddit = '', page = 1) => (
  fetch(`${baseURL}/threads?subreddit=${subreddit}&page=${page - 1}`)
    .then(json)
)
