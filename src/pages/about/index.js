import React from 'react'
import { connect } from '../../state'

const About = props => {
  document.title = 'About Removeddit'
  if (props.global.state.statusImage !== undefined) {
    props.global.clearStatus()
  }

  return (
    <div id='main'>
      <div id='main-box'>
        <h2 className='about'>About</h2>
        <p>
          Display
          <b className='removed-text' title='Removed by mods'> removed </b>
          (by mods) and
          <b className='deleted-text' title='Deleted by users'> deleted </b>
          (by users) comments/threads from  Reddit.
        </p>
        <p>
          <b>Usage</b>: Drag this bookmarklet
          <a className='bookmarklet' href="javascript: document.location = document.URL.replace('reddit.com','removeddit.com');">
            Removeddit
          </a>
          to your bookmark bar and use it to get from reddit to removeddit.
          <br /><br />
          Alternatively you can manually replace the <i>reddit</i> in the URL to <i>removeddit</i>.
          <br />
          E.g. <a href='/r/TwoXChromosomes/comments/6z1hch/'>https://www.removeddit.com/r/TwoXChromosomes/comments/6z1hch/</a>
        </p>
        <p>
          Created by
          <a href='https://github.com/JubbeArt/'> Jesper Wrang </a> and uses
          <a href='https://pushshift.io/'> Jason Baumgartner </a> service for getting removed comments.
        </p>
        <h2 className='todo'>FAQ</h2>
        <b>Q: I posted some sensitive information on Reddit. Can you delete this from your page?</b>
        <p>
          No, I can't remove anything myself since I am not the not the one storing all the deleted comment.
          This is done by an external service run by Jason Baumgartner (<a href='https://www.reddit.com/user/Stuck_In_the_Matrix'>/u/Stuck_In_the_Matrix</a>).
          If you want something sensitive removed permanently you should contact him.
        </p>
        <b>Q: How does it work?</b>
        <p>
          This page is only possible because of the amzaing work done by Jason.
          His site <a href='https://pushshift.io/'>pushshift.io</a> activly listens for new comments on reddit and stores them in his own database.
          Then sites like removeddit and ceddit can fetch these comment from pushshift.
          Removeddit know what comment reddit shows (from Reddits API) and what comment should be showed (from Pushshift).
          By comparing the comments from these 2 APIs, we can figure out what has been deleted and removed.
        </p>
        <h2 className='contact'>Links/Contact</h2>
        <p style={{ marginBottom: '8px' }}>For feedback and bug reports:</p>
        <ul>
          <li>email: removeddit (at) gmail.com</li>
          <li>reddit: <a href='https://www.reddit.com/user/Jubbeart/'>/u/JubbeArt</a> (not active anymore)</li>
        </ul>
        <p>
          <a href='https://github.com/JubbeArt/removeddit'>Code on Github.</a>
        </p>
      </div>
    </div>
  )
}

export default connect(About)
