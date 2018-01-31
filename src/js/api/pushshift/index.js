import { json, toBase10, toBase36, chunk, flatten } from 'utils'

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

export const getComments = commentIDs => (
  Promise.all(chunk(commentIDs, 100).map(fetchComments)).then(flatten)
)

const fetchComments = commentIDs => {
  const elasticQuery = {
    query: {
      ids: {
        values: commentIDs.map(toBase10),
      },
    },
    _source: [
      'author', 'body', 'created_utc', 'parent_id', 'score',
    ],
  }

  return (
    fetch(commentURL + JSON.stringify(elasticQuery))
      .then(json)
      .then(jsonData => jsonData.hits.hits)
      .then(comments => comments.map(comment => {
        comment._source.id = toBase36(comment._id)

        if (!comment._source.parent_id) {
          console.log('MISSING PARENT ID')
        }

        comment._source.parent_id = toBase36(comment._source.parent_id)
        return comment._source
      }))
  )
}
