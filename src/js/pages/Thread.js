import React from 'react'
import ThreadHead from 'components/ThreadHead'
import { getThread } from 'reddit'

export default class Thread extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      thread: {},
    }
  }

  componentDidMount() {
    getThread(this.props.match.params.subreddit, this.props.match.params.threadID)
      .then(thread => {
        this.setState({ thread })

        // check if thread is deleted
        // if(thread.)
        return thread
      })
  }

  render() {
    return (
      <>
        <ThreadHead {...this.state.thread} />
        <h1>lol</h1>
      </>
    )
  }
}
