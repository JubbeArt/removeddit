import {html} from 'lit-html'

const statusBox = props => html`
  <div id="status">
    ${props.text &&
    html`<p id="status-text">{props.text}</p>`}
    ${props.image &&
    html`<img id="status-image" src={props.image} alt="status" />`}
  </div>
  `

// const mapStateToProps = state => ({
//   text: state.status.text,
//   image: state.status.image
// })

export default statusBox
