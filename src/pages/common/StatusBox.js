import React from 'react'
import {connect} from '../../state'

const StatusBox = props => (
  <div id='status'>
    {props.text &&
    <p id='status-text'>{props.gloabl.state.statusText}</p>}
    {props.image &&
    <img id='status-image' src={props.gloabl.state.statusImage} alt='status' />}
  </div>
)

export default connect(StatusBox)
