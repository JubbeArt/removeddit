import React from 'react'
import ThreadHead from 'components/ThreadHead'
import { getThread } from 'reddit'
import { getThread as getRemovedThread } from 'pushshift'
import { isDeleted } from 'utils'

export default class Thread extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      thread: {},
    }
  }

  componentDidMount() {
    const { subreddit, threadID } = this.props.match.params

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
      })
  }

  render() {
    return (
      <div>
        <ThreadHead {...this.state.thread} />
        <h1>lol</h1>
      </div>
    )
  }
}
