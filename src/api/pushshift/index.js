import { toBase10, toBase36 } from '../../utils'

const postURL = 'https://elastic.pushshift.io/rs/submissions/_search?source='
const commentURL = 'https://elastic.pushshift.io/rc/comments/_search?source='

export const getPost = threadID => {
  const elasticQuery = {
    query: {
      term: {
        id: toBase10(threadID)
      }
    }
  }

  return window.fetch(postURL + JSON.stringify(elasticQuery))
    .then(response => response.json())
    .then(response => {
      const post = response.hits.hits[0]._source
      post.id = toBase36(post.id)
      return post
    })
    .catch(() => { throw new Error('Could not get removed post') })
}

export const getComments = threadID => {
  const elasticQuery = {
    query: {
      match: {
        link_id: toBase10(threadID)
      }
    },
    size: 20000,
    _source: [
      'author', 'body', 'created_utc', 'parent_id', 'score', 'subreddit', 'link_id'
    ]
  }

  return window.fetch(commentURL + JSON.stringify(elasticQuery))
    .then(response => response.json())
    .then(response => {
      const comments = response.hits.hits
      return comments.map(comment => {
        comment._source.id = toBase36(comment._id)
        comment._source.link_id = toBase36(comment._source.link_id)

        // Missing parent id === direct reply to thread
        if (!comment._source.parent_id) {
          comment._source.parent_id = threadID
        } else {
          comment._source.parent_id = toBase36(comment._source.parent_id)
        }

        return comment._source
      })
    })
    .catch(() => { throw new Error('Could not get removed comments') })
}
