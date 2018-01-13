import React from 'react'

export default class StatusBox extends React.Component {	
	render() {
		return (
				<div id='status'>
					{this.props.text &&
					<p id='status-text'>{lol}</p>}
					{this.props.image &&
					<img id='status-image' src={lol}/>}
				</div>
		)
	}
}