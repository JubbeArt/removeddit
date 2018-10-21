// Change this to your own client ID: https://www.reddit.com/prefs/apps
// The app NEEDS TO BE an installed app and NOT a web apps

// Current using dummy ID from throwaway
const clientID = 'Gu4d7t1AglWJVg'

// Token for reddit API
let token

const getToken = () => {
  // We have already gotten a token
  if (token !== undefined) {
    return Promise.resolve(token)
  }

  // Headers for getting reddit api token
  const tokenInit = {
    headers: {
      Authorization: `Basic ${window.btoa(`${clientID}:`)}`,
      'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
    },
    method: 'POST',
    body: `grant_type=${encodeURIComponent('https://oauth.reddit.com/grants/installed_client')}&device_id=DO_NOT_TRACK_THIS_DEVICE`
  }

  return window.fetch('https://www.reddit.com/api/v1/access_token', tokenInit)
    .then(response => response.json())
    .then(response => {
      token = response.access_token
      return token
    })
}

// Get header for general api calls
export const getAuth = () => {
  return getToken()
    .then(token => ({
      headers: {
        Authorization: `bearer ${token}`
      }
    }))
}
