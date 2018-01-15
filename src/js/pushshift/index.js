import { json, toBase10, toBase36 } from 'utils'

const baseURL = 'https://elastic.pushshift.io'
const threadURL = `${baseURL}/rs/submissions/_search?source=`
const commentURL = `${baseURL}/rc/comments/_search?source=`
const commentIDsURL = 'https://api.pushshift.io/reddit/submission/comment_ids/'


export const getCommentIDs = threadID => (
  fetch(commentIDsURL + threadID)
    .then(json)
    .then(results => results.data)
)

export const getThread = threadID => {
  const elasticQuery = {
    query: {
      term: {
        id: toBase10(threadID),
      },
    },
  }

  return (
    fetch(threadURL + JSON.stringify(elasticQuery))
      .then(json)
      .then(jsonData => jsonData.hits.hits[0]._source)
      .then(thread => {
        thread.id = toBase36(thread.id)
        return thread
      })
  )
}

// getComments (handle more than 100, try 50, 25 etc....)
export const test = threadID => {
  const elasticQuery = {
    query: {
      term: {
        link_id: toBase10(threadID),
      },
    },
    size: 10000,
  }

  return (
    fetch(commentURL + JSON.stringify(elasticQuery))
      .then(json)
      .then(results => {
        results.hits.hits.map(result => {
          result._source.link_id = toBase36(result._source.link_id)
          result._source.parent_id = toBase36(result._source.parent_id)
          result._source.id = toBase36(result._id)

          return result._source
        })
      })
  )
}
