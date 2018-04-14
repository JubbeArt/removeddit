import {html} from 'lit-html'

export default () => html`
  <div id="main-box">
    <h2 class="about">About</h2>
    <p>
      Display
      <b class="removed-text" title="Removed by mods"> removed </b>
      (by mods) and
      <b class="deleted-text" title="Deleted by users"> deleted </b>
      (by users) comments/threads from  Reddit.
    </p>
    <p>
      <b>Usage</b>: Drag this bookmarklet
      <a class="bookmarklet" href="javascript: document.location = document.URL.replace('reddit.com','removeddit.com');">
        Removeddit
      </a>
      to your bookmark bar and use it to get from reddit to removeddit.
      <br /><br />
      Alternatively you can manually replace the <i>reddit</i> in the URL to <i>removeddit</i>.
      <br />
      E.g. <a href="/r/TwoXChromosomes/comments/6z1hch/">https://www.removeddit.com/r/TwoXChromosomes/comments/6z1hch/</a>
    </p>
    <p>
      Created by
      <a href="https://github.com/JubbeArt/"> Jesper Wrang </a> and uses
      <a href="https://pushshift.io/"> Jason Baumgartner </a> service for getting removed comments.
    </p>
    <h2 class="todo">TODO</h2>
    <ul>
      <li>Collapsing comments</li>
      <li>Maybe for specific users </li>
    </ul>
    <h2 class="contact">Links/Contact</h2>
    <p style="margin-bottom: 8px">For feedback and bug reports:</p>
    <ul>
      <li>email: removeddit (at) gmail.com</li>
      <li>reddit: <a href="https://www.reddit.com/user/Jubbeart/">/u/JubbeArt</a></li>
    </ul>
    <p>
      <a href="https://github.com/JubbeArt/removeddit">Code on Github.</a>
    </p>
  </div>
  `
