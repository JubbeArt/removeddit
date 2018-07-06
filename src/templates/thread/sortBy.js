import {html} from 'lit-html/lib/lit-extended'

export default (state, setState) => html`
  <div id="comment-sort">
  sorted by:
    <span class="space" />
    <select onchange="${e => (e.target.value)}">
      <option value="top">top</option>
      <option value="bottom">bottom</option>
      <option value="new">new</option>
      <option value="old">old</option>
    </select>
    <span class="space" />
  show:
    <span class="space" />
    <select onChange="${e => (e.target.value)}">
      <option value="all">All comments</option>
      <option value="removedDeleted">Removed and deleted</option>
      <option value="removed">Removed</option>
      <option value="deleted">Deleted</option>
    </select>
  </div>
  `
