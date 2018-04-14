import {html} from 'lit-html'
import { prettyScore, prettyDate, parse } from 'utils'

const comment = props => {
  let commentStyle = 'comment '

  if (props.removed) {
    commentStyle += 'removed'
  } else if (props.deleted) {
    commentStyle += 'deleted'
  } else {
    commentStyle += props.depth % 2 === 0 ? 'comment-even' : 'comment-odd'
  }

  const innerHTML = (props.body === '[removed]' && props.removed) ? '<p>[removed too quickly to be archived]</p>' : parse(props.body)
  const permalink = `/r/${props.subreddit}/comments/${props.link_id}/_/${props.id}/`

  return html`
    <div id="${props.id}" class="${commentStyle}">
      <div class="comment-head">
        <a href="#" onclick="${() => false}" class="author">[–]</a>
        <span class="space"></span>
        <a
          href="${props.author !== '[deleted]' ? `https://www.reddit.com/user/${props.author}` : undefined}"
          class="author comment-author"
        >
          ${props.author}
          ${props.deleted && ' (deleted by user)'}
        </a>
        <span class="space"></span>
        <span class="comment-score">${prettyScore(props.score)} point${(props.score !== 1) && 's'}</span>
        <span class="space"></span>
        <span class="comment-time">${prettyDate(props.created_utc)}</span>
      </div>
      <div class="comment-body">
        ${innerHTML}
      </div>
      <div class="comment-links">
        <a href="${permalink}">permalink</a>
        <a href="${`https://www.reddit.com${permalink}`}">reddit</a>
        <a href="${`https://snew.github.io${permalink}`}">ceddit</a>
      </div>
      <div>
        ${props.replies.map(com => comment(com))}
      </div>
    </div>
    `
}

export default comment
