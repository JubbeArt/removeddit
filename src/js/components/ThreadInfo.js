import React from 'react'

export default (props) => {
	return (
		<>
			<div id='comment-info'>
				removed comments: {props.removedComments}/${props.totalComments} ({(100 * removedComments / totalComments).toFixed(1)}%)
			</div>
			<div id='comment-sort'>sorted by: top</div>
		</>
	)
}