import React from 'react'
import Post from '../common/Post'
import CommentSection from './CommentSection'
import {
  getPost,
  getComments as getRedditComments
} from '../../api/reddit'
import {
  getPost as getRemovedPost,
  getComments as getPushshiftComments
} from '../../api/pushshift'
import { isDeleted, isRemoved } from '../../utils'
import CommentInfo from './CommentInfo'
import SortBy from './SortBy'
import { connect } from '../../state'

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

    // Get thread from reddit
    getPost(subreddit, threadID)
      .then(post => {
        this.setState({ post })
        // Fetch the thread from pushshift if it was deleted/removed
        if (isDeleted(post.selftext)) {
          getRemovedPost(threadID)
            .then(removedPost => {
              removedPost.removed = true
              this.setState({ post: removedPost })
            })
        }
      })
      .catch(error => console.log(error))

      // Get comment ids from pushshift
    getPushshiftComments(threadID)
      .then(pushshiftComments => {
        // Extract ids from pushshift response
        const ids = pushshiftComments.map(comment => comment.id)

        // Get all the comments from reddit
        return (
          getRedditComments(ids)
            .then(redditComments => {
              const redditCommentLookup = {}
              redditComments.forEach(comment => {
                redditCommentLookup[comment.id] = comment
              })

              pushshiftComments.forEach(comment => {
                // Replace pushshift score with reddit (its usually more accurate)
                const redditComment = redditCommentLookup[comment.id]
                if (redditComment !== undefined) {
                  comment.score = redditComment.score
                }
              })

              this.setState({ pushshiftComments })
              return redditComments
            })
        )
      })
      .then(redditComments => {
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

        this.setState({
          removed,
          deleted,
          loadingComments: false
        })
      })
  }

  render () {
    let root = this.state.post.id

    if (this.props.match.params.commentID !== undefined) {
      root = this.props.match.params.commentID
    }

    return (
      <div>
        <Post {...this.state.post} />
        {
          !this.state.loadingComments &&
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
      </div>
    )
  }
}

export default connect(Thread)
