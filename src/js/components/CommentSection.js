import React from 'react'

export default (props) => {
	return (
		<div id={props.root}>
			{props.children}
		</div>
	)
}