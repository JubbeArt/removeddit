import React from 'react'

export default class Menu extends React.Component {
	render () {
		return (
			<header>
				<div id="header">
					<h1>
						<a href="/">Removeddit</a>
					</h1>
					<nav>
						<a href="/r/all">subreddit</a>
						<a href="/r/bestof/comments/7c8jof/">thread</a>
						<a href="/about/">about</a>
					</nav>
				</div>
				<div id="status">
					<p id="status-text"></p>
					<img id="status-image" src="/images/loading.gif"/>
				</div>
			</header>
		)
	}
 
}