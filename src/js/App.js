import React from 'react'
import {
	BrowserRouter,
	Switch,
	Route,
	IndexRoute
} from 'react-router-dom'

import Menu from 'components/Menu'
import {About, Thread, Subreddit} from 'pages'

class App extends React.Component {
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
					<Menu status={this.props.status}/>
					<div className='main'>
						<Switch>			
							<Route exact path='/' component={Thread} />
							<Route path='/about' component={About}/>
							<Route path='/r/:subreddit/comments/:threadID' component={Thread}/>
						</Switch>
					</div>
				</>			
			</BrowserRouter>
		)
	}
}

export default App