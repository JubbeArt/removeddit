import {html} from 'lit-html/lib/lit-extended'

const getProcent = (part, total) => (total === 0 ? '0.0' : ((100 * part) / total).toFixed(1))

export default ({ removed, deleted, total }) => html`
  <div id="comment-info">
    <span class="removed-text">
      removed comments: ${removed}/${total} (${getProcent(removed, total)}%)
    </span>
    <br />
    <span class="deleted-text">
      deleted comments:  ${deleted}/${total} (${getProcent(deleted, total)}%)
    </span>
  </div>
`
