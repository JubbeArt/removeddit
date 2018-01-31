import React from 'react'
import ThreadHead from 'components/ThreadHead'
import CommentSection from 'components/CommentSection'
import {
  getThread,
  getCommentIDs,
  extractHead,
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
    console.timeEnd('scripts loaded')
    let pushshiftCommentIDs

    Promise.all([


      // OUTDATED
      // Get thread from reddit
      // getThread(subreddit, threadID)
      //   .then(extractHead)
      //   .then(thread => {
      //     this.setState({ thread })

      //     // Fetch the thread from pushshift if it was deleted/removed
      //     if (isDeleted(thread.selftext)) {
      //       getRemovedThread(threadID)
      //         .then(removedThread => {
      //           removedThread.removed = true
      //           this.setState({ thread: removedThread })
      //         })
      //     }
      //   })
      //   // Get comment ids from reddit
      //   .then(() => getCommentIDs(subreddit, threadID)),

      // Get comment ids from pushshift
      getAllCommentIDs(threadID)
        .then(commentIDs => { pushshiftCommentIDs = commentIDs }),
    ])
      .then(() => {
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
