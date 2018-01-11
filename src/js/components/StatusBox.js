import React from 'react'

export default class StatusBox extends React.Component {	
	render() {
		return (
				<div id='status'>
					{this.props.text &&
					<p id='status-text'>{this.props.text}</p>}
					{this.props.image &&
					<img id='status-image' src={this.props.image}/>}
				</div>
		)
	}
}