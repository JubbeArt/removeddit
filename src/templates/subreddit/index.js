import { html } from 'lit-html/lib/lit-extended'
import post from '../thread/post'

export default (state, setState) => {
  const { subreddit, threads } = state
  const subredditLink = `/r/${subreddit}`

  return (
    html`
      <div class="subreddit-box">
        <a href="${subredditLink}" class="subreddit-title" data-navigo>${subredditLink}</Link>
        <span class="space" />
        <a href="${`https://www.reddit.com${subredditLink}`}" class="subreddit-title-link">reddit</a>
        <span class="space" />
        <a href="${`https://snew.github.io${subredditLink}`}" class="subreddit-title-link">ceddit</a>
      </div>
      ${threads.map(thread => post(thread))}
  `
  )
}
