import { chunk, flatten, json } from 'utils'
import { getAuth } from './auth'

export const getComments = commentIDs => (
  getAuth()
    .then(auth => (
      Promise.all(chunk(commentIDs, 100).map(ids => fetchComments(ids, auth))).then(flatten)
    ))
)

export const fetchComments = (commentIDs, auth) => (
  fetch(`https://oauth.reddit.com/api/info?id=${commentIDs.map(id => `t1_${id}`).join()}`, auth)
    .then(json)
    .then(results => results.data.children)
    .then(commentsData => commentsData.map(commentData => commentData.data))
)

const debug = results => {
  console.log(JSON.parse(JSON.stringify(results)))
}

