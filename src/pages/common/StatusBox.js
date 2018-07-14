import React from 'react'
import { connect } from 'react-redux'

const StatusBox = props => (
  <div id='status'>
    {props.text &&
    <p id='status-text'>{props.text}</p>}
    {props.image &&
    <img id='status-image' src={props.image} alt='status' />}
  </div>
)

const mapStateToProps = state => ({
  text: state.status.text,
  image: state.status.image
})

export default connect(mapStateToProps)(StatusBox)
