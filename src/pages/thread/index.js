import React from 'react'
import {
  getPost,
  getComments as getRedditComments
} from '../../api/reddit'
import {
  getPost as getRemovedPost,
  getComments as getPushshiftComments
} from '../../api/pushshift'
import { isDeleted, isRemoved } from '../../utils'
import { connect } from '../../state'
import Post from '../common/Post'
import CommentSection from './CommentSection'
import SortBy from './SortBy'
import CommentInfo from './CommentInfo'

class Thread extends React.Component {
  state = {
    post: {},
    pushshiftComments: [],
    removed: [],
    deleted: [],
    loadingComments: true
  }

  componentDidMount () {
    const { subreddit, threadID } = this.props.match.params
    this.props.global.setLoading('Loading comments from Pushshift...')

    // Get thread from reddit
    getPost(subreddit, threadID)
      .then(post => {
        this.setState({ post })
        document.title = post.title
        // Fetch the thread from pushshift if it was deleted/removed
        if (isDeleted(post.selftext) || isRemoved(post.selftext)) {
          getRemovedPost(threadID)
            .then(removedPost => {
              if (isRemoved(post.selftext)) {
                removedPost.removed = true
              } else {
                removedPost.deleted = true
              }
              this.setState({ post: removedPost })
            })
        }
      })
      .catch(this.props.global.setError)

    // Get comment ids from pushshift
    getPushshiftComments(threadID)
      .then(pushshiftComments => {
        // Extract ids from pushshift response
        const ids = pushshiftComments.map(comment => comment.id)
        this.props.global.setLoading('Comparing comments to Reddit API...')
        // Get all the comments from reddit
        return getRedditComments(ids)
          .then(redditComments => {
            // Temporary lookup for updating score
            const redditCommentLookup = {}
            redditComments.forEach(comment => {
              redditCommentLookup[comment.id] = comment
            })

            // Replace pushshift score with reddit (its usually more accurate)
            pushshiftComments.forEach(comment => {
              const redditComment = redditCommentLookup[comment.id]
              if (redditComment !== undefined) {
                comment.score = redditComment.score
              }
            })

            const removed = []
            const deleted = []

            // Check what as removed / deleted according to reddit
            redditComments.forEach(comment => {
              if (isRemoved(comment.body)) {
                removed.push(comment.id)
              } else if (isDeleted(comment.body)) {
                deleted.push(comment.id)
              }
            })

            console.log(`Pushshift: ${pushshiftComments.length} comments`)
            console.log(`Reddit: ${redditComments.length} comments`)

            this.props.global.setSuccess()
            this.setState({
              pushshiftComments,
              removed,
              deleted,
              loadingComments: false
            })
          })
      })
      .catch(this.props.global.setError)
  }

  render () {
    let root = this.state.post.id

    if (this.props.match.params.commentID !== undefined) {
      root = this.props.match.params.commentID
    }

    return (
      <React.Fragment>
        <Post {...this.state.post} />
        {
          (!this.state.loadingComments && root) &&
          <React.Fragment>
            <CommentInfo
              total={this.state.pushshiftComments.length}
              removed={this.state.removed.length}
              deleted={this.state.deleted.length}
            />
            <SortBy />
            <CommentSection
              root={root}
              comments={this.state.pushshiftComments}
              removed={this.state.removed}
              deleted={this.state.deleted}
            />
          </React.Fragment>
        }
      </React.Fragment>
    )
  }
}

export default connect(Thread)
