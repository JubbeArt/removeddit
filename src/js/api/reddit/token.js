import { json } from 'utils'
import clientID from './clientID'

// Token for reddit API
let token = null

// Headers for getting reddit api token
const tokenInit = {
  headers: {
    Authorization: `Basic ${btoa(`${clientID}:`)}`,
    'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
  },
  method: 'POST',
  body: `grant_type=${encodeURIComponent('https://oauth.reddit.com/grants/installed_client')}&device_id=DO_NOT_TRACK_THIS_DEVICE`,
}

export const getToken = () => {
  if (token !== null) {
    return Promise.resolve(token)
  }

  return (
    fetch('https://www.reddit.com/api/v1/access_token', tokenInit)
      .then(json)
      .then(response => {
        token = response.access_token
        return token
      })
  )
}
