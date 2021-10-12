const postURL = 'https://api.pushshift.io/reddit/search/submission'
const commentsURL = 'https://api.pushshift.io/reddit/submission/comment_ids/'
const commentURL = 'https://api.pushshift.io/reddit/search/comment'

const fetchJson = (url) => window.fetch(url).then((response) => response.json())

export const getPost = (threadID) =>
  fetchJson(`${postURL}?ids=${threadID}&size=1`)
    .then(([result]) => result)
    .catch(() => {
      throw new Error('Could not get removed post')
    })

export const getComments = (threadID) =>
  fetchJson(`${commentsURL}${threadID}`)
    .then(({ data }) => fetchJson(`${commentURL}?ids=${data.join(',')}`))
    .then(({ data }) =>
      data.map((comment) => ({
        ...comment,
        parent_id: comment.parent_id.substring(3) || threadID,
      }))
    )
    .catch(() => {
      throw new Error('Could not get removed comments')
    })
