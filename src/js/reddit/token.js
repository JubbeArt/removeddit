import { json } from 'utils'
import clientID from './clientID'

// Connecting to Reddit API
let hasToken = false

// Headers for general api calls
export const redditAuth = {
  headers: {
    Authorization: '',
  },
}

// Headers for getting reddit api token
const tokenInit = {
  headers: {
    Authorization: `Basic ${btoa(`${clientID}:`)}`,
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
  },
  method: 'POST',
  body: `grant_type=${encodeURIComponent('https://oauth.reddit.com/grants/installed_client')}&device_id=DO_NOT_TRACK_THIS_DEVICE`,
}

export const fetchToken = () => {
  if (hasToken) {
    return Promise.resolve()
  }

  return (
    fetch('https://www.reddit.com/api/v1/access_token', tokenInit)
      .then(json)
      .then(jsonData => {
        redditAuth.headers.Authorization = `bearer ${jsonData.access_token}`;
        hasToken = true
      })
  )
}
