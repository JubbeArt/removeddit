import {html} from 'lit-html/lib/lit-extended'

import { prettyScore, prettyDate, parse, redditThumbnails, isDeleted } from '../../utils'

export default (props) => {
  if (!props.title) {
    return html`<div></div>`
  }

  const url = props.url.replace('https://www.reddit.com', '')
  const userLink = isDeleted(props.author) ? undefined : `https://www.reddit.com/user/${props.author}`

  const thumbnailWidth = props.thumbnail_width ? props.thumbnail_width * 0.5 : 70
  const thumbnailHeight = props.thumbnail_height ? props.thumbnail_height * 0.5 : 70
  let thumbnail

  if (redditThumbnails.includes(props.thumbnail)) {
    thumbnail = html`<a href="${url}" class$="${`thumbnail thumbnail-${props.thumbnail}`}"></a>`
  } else if (props.thumbnail !== '') {
    thumbnail = html`
      <a href="${url}">
        <img class="thumbnail" src="${props.thumbnail}" width="${thumbnailWidth}" height="${thumbnailHeight}" alt="Thumbnail" />
      </a>
      `
  }

  return html`
    <div class$="thread ${props.removed && 'removed'}">
      ${props.position &&
      html`<span class="post-rank">${props.position}</span>`}
      <div class="thread-score-box">
        <div class="vote upvote"></div>
        <div class="thread-score">${prettyScore(props.score)}</div>
        <div class="vote downvote"></div>
      </div>
      ${thumbnail}
      <div class="thread-content">
        <a class="thread-title" href="${url}">${props.title}</a>
        ${props.link_flair_text &&
        html`<span class="link-flair">${props.link_flair_text}</span>`}
        <span class="domain">(${props.domain})</span>
        <div class="thread-info">
          submitted <span class="thread-time">${prettyDate(props.created_utc)}</span> by&nbsp;
          <a class="thread-author author" href="${userLink}">${props.author}</a>
          &nbsp;to <a class="subreddit-link author" href="${`/r/${props.subreddit}`}">/r/${props.subreddit}</a>
        </div>
        ${props.selftext &&
        html`<div class="thread-selftext user-text">${parse(props.selftext)}</div>`}
        <div class="total-comments">
          <a class="grey-link" href="${props.permalink}">
            <b>${props.num_comments} comments</b>
          </a>&nbsp;
          <a class="grey-link" href="${`https://www.reddit.com${props.permalink}`}">
            <b>reddit</b>
          </a>&nbsp;
          <a class="grey-link" href="${`https://snew.github.io${props.permalink}`}">
            <b>ceddit</b>
          </a>
        </div>
      </div>
    </div>
  `
}
