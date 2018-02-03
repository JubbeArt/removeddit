import React from 'react'
import Post from 'components/Post'
import CommentSection from 'components/CommentSection'
import {
  getPost,
  getCommentIDs,
} from 'api/reddit'
import {
  getPost as getRemovedPost,
  getCommentIDs as getAllCommentIDs,
  getComments as getRemovedComments,
} from 'api/pushshift'
import { isDeleted } from 'utils'
import { difference } from '../utils/index'

export default class Thread extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      post: {},
      comments: [],
    }
  }

  componentDidMount() {
    const { subreddit, threadID } = this.props.match.params
    console.timeEnd('scripts loaded')

    Promise.all([
      // Get thread from reddit
      getPost(subreddit, threadID)
        .then(post => {
          this.setState({ post })
          // Fetch the thread from pushshift if it was deleted/removed
          if (isDeleted(post.selftext)) {
            // getRemovedPost(threadID)
            //   .then(removedPost => {
            //     removedPost.removed = true
            //     this.setState({ post: removedPost })
            //   })
          }
        })
      // Get comment ids from reddit
        .then(() => getCommentIDs(subreddit, threadID)),

      // Get comment ids from pushshift
      getAllCommentIDs(threadID),
    ])
      .then(results => {
        const foundIDs = results[0]
        const allIDs = results[1]

        const removedIDs = difference(allIDs, foundIDs)
        // Get removed comments from pushshift
        return getRemovedComments(removedIDs)
      })
  }

  render() {
    return (
      <div>
        <Post {...this.state.post} />
        <CommentSection root={this.state.post.id} comments={this.state.comments} />
      </div>
    )
  }
}
