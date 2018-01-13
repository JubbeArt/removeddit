import React from 'react'
import {
	BrowserRouter,
	Switch,
	Route,
	IndexRoute
} from 'react-router-dom'

import Menu from 'components/Menu'
import {About, Thread, Subreddit} from 'pages'

export default class App extends React.Component {
	constructor(props) {
		super(props)

	}
	
	handleStatusChange(text, image) {
		this.setState({
			statusText: text,
			statusImage: image 
		})
	}

	render() {
		return (
			<BrowserRouter basename={__dirname}>
				<>
					<Menu />
					<Switch>			
						<Route exact path='/' component={Thread} />
						<Route path='/about' component={About}/>
						<Route path='/r/:subreddit/comments' component={Thread}/>
					</Switch>
				</>			
			</BrowserRouter>
		)
	}
}