import { html } from 'lit-html/lib/lit-extended'
import post from './thread/post'

export default ({ subreddit, threads }, setState) => (
  html`
    <div class="subreddit-box">
      <a href="/r/${subreddit}" class="subreddit-title" data-navigo>/r/${subreddit}</Link>
      <span class="space" />
      <a href="${`https://www.reddit.com/r/${subreddit}`}" class="subreddit-title-link">reddit</a>
      <span class="space" />
      <a href="${`https://snew.github.io/r/${subreddit}`}" class="subreddit-title-link">ceddit</a>
    </div>
    ${threads.map(thread => post(thread))}
  `
)
