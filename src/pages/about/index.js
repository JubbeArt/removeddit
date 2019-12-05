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
        <p>a</p>
        <b>Q: How does it work?</b>

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
