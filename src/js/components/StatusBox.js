import React from 'react'
import { connect } from 'react-redux'

class StatusBox extends React.Component {
  render() {
    return (
      <div id='status'>
        {this.props.text &&
        <p id='status-text'>{this.props.text}</p>}
        {this.props.image &&
        <img id='status-image' src={this.props.image} />}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  text: state.status.text,
  image: state.status.image,
})

export default connect(mapStateToProps)(StatusBox)
