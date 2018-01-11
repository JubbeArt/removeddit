import React from 'react'
import StatusBox from 'components/StatusBox'

export default class Menu extends React.Component {
	render () {
		return (
			<header>
				<div id='header'>
					<h1>
						<Link to='/'>Removeddit</Link>
					</h1>
					<nav>
						<Link to='/r/all'>/r/all</Link>
						<Link to='/r/bestof/comments/7c8jof/'>thread</Link>
						<Link to='/about/'>about</Link>
					</nav>
				</div>
				<StatusBox text={this.props.statusText} image={this.props.statusImage} />
			</header>
		)
	}
 
}