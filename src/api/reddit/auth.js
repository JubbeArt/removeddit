import { getToken } from './token'

// Header for general api calls
export const getAuth = () => (
  getToken()
    .then(token => ({
      headers: {
        Authorization: `bearer ${token}`
      }
    }))
)
