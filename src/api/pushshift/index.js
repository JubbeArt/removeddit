import { json, toBase10, toBase36 } from 'utils'

const baseURL = 'https://elastic.pushshift.io'
const postURL = `${baseURL}/rs/submissions/_search?source=`
const commentURL = `${baseURL}/rc/comments/_search?source=`

export const getPost = threadID => {
  const elasticQuery = {
    query: {
      term: {
        id: toBase10(threadID)
      }
    }
  }

  return (
    window.fetch(postURL + JSON.stringify(elasticQuery))
      .then(json)
      .then(jsonData => jsonData.hits.hits[0]._source)
      .then(post => {
        post.id = toBase36(post.id)
        return post
      })
  )
}

// export const getComments = threadID => (
//   fetch(`https://api.pushshift.io/reddit/comment/search?link_id=${threadID}&limit=10000`)
//     .then(json)
//     .then(data => data.data)
//     .then(comments => {
//       comments.forEach(comment => {
//         comment.link_id = comment.link_id.split('_')[1]
//         comment.parent_id = comment.parent_id.split('_')[1]
//       })
//       return comments
//     })
// )

export const getComments = threadID => {
  const elasticQuery = {
    query: {
      match: {
        link_id: toBase10(threadID)
      }
    },
    size: 10000,
    _source: [
      'author', 'body', 'created_utc', 'parent_id', 'score', 'subreddit', 'link_id'
    ]
  }

  return (
    window.fetch(commentURL + JSON.stringify(elasticQuery))
      .then(json)
      .then(jsonData => jsonData.hits.hits)
      .then(comments => comments.map(comment => {
        comment._source.id = toBase36(comment._id)
        comment._source.link_id = toBase36(comment._source.link_id)

        // Missing parent id === direct reply to thread
        if (!comment._source.parent_id) {
          comment._source.parent_id = threadID
        } else {
          comment._source.parent_id = toBase36(comment._source.parent_id)
        }

        return comment._source
      }))
  )
}
