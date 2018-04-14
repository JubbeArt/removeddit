import {html} from 'lit-html'

const getProcent = (part, total) => (total === 0 ? '0.0' : ((100 * part) / total).toFixed(1))

export default (props) => html`
  <div id="comment-info">
    <span class="removed-text">
      removed comments: ${props.removed}/${props.total} (${getProcent(props.removed, props.total)}%)
    </span>
    <br />
    <span class="deleted-text">
      deleted comments:  ${props.deleted}/${props.total} (${getProcent(props.deleted, props.total)}%)
    </span>
  </div>
`
