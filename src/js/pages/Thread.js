import React from 'react'
import ThreadHead from 'components/ThreadHead'
import CommentSection from 'components/CommentSection'
import {
  getThread,
  getCommentIDs,
} from 'reddit'
import {
  getThread as getRemovedThread,
  getCommentIDs as getAllCommentIDs,
} from 'pushshift'
import { isDeleted } from 'utils'

export default class Thread extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      thread: {},
      comments: [],
    }
  }

  componentDidMount() {
    const { subreddit, threadID } = this.props.match.params

    let pushshiftCommentIDs

    Promise.all([
      // Get thread from reddit
      getThread(subreddit, threadID)
        .then(thread => {
          this.setState({ thread })

          // Fetch the thread from pushshift if it was deleted/removed
          if (isDeleted(thread.selftext)) {
            getRemovedThread(threadID)
              .then(removedThread => {
                removedThread.removed = true
                this.setState({ thread: removedThread })
              })
          }
        }),

      // Get comment ids from pushshift
      getAllCommentIDs(threadID)
        .then(commentIDs => { pushshiftCommentIDs = commentIDs }),
    ])
      .then(() => {
        // Get comment ids from reddit
        getCommentIDs()
        // .then(console.log)
      })
  }

  render() {
    return (
      <div>
        <ThreadHead {...this.state.thread} />
        <CommentSection root={this.state.thread.id} comments={this.state.comments} />
      </div>
    )
  }
}
