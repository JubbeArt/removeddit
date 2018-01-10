import React from 'react'

export default class Menu extends React.Component {
	render () {
		return (
			<header>
				<div id='header'>
					<h1>
						<Link to='/'>Removeddit</Link>
					</h1>
					<nav>
						<Link to='/r/all'>subreddit</Link>
						<Link to='/r/bestof/comments/7c8jof/'>thread</Link>
						<Link to='/about/'>about</Link>
					</nav>
				</div>
				<div id='status'>
					<p id='status-text'></p>
					<img id='status-image' src='/images/loading.gif'/>
				</div>
			</header>
		)
	}
 
}