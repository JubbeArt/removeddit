import React from 'react'
import {
	BrowserRouter,
	Switch,
	Route
} from 'react-router-dom'

// Pages
import Menu from 'components/Menu'
import About from 'components/About'
import Thread from 'components/Thread'

export default class App extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			statusText: null,
			statusImage: null
		}

		this.onStatusChange = this.onStatusChange.bind(this)
	}
	
	handleStatusChange(text, image)  {
		this.setState({
			statusText: text,
			statusImage: image 
		})
	}

	render() {
		return (
			<BrowserRouter basename={__dirname}>
				<>
					<Menu statusText={this.state.statusText} statusImage={this.state.statusImage} />
					<Switch>			
						<IndexRoute component={Thread} />
						<Route path='/about' component={About}/>
						<Route path='/r/:subreddit/comments' onStatusChange={this.handleStatusChange} component={Thread}/>
						{/* <Route path='/:board/:pageNr' component={Board} />
						<Route path='/:board/thread/:thread' component={Thread}/>
						<Route component={Home} /> */}
					</Switch>
				</>			
			</BrowserRouter>
		)
	}
}