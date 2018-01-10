import React from 'react'
import {
	BrowserRouter,
	Switch,
	Route
} from 'react-router-dom'

import Menu from 'components/Menu'
import About from 'components/About'
import Thread from 'components/Thread'

export default class App extends React.Component {
	render() {
		return (
			<BrowserRouter basename={__dirname}>
				<>
					<Menu />
					<Switch>			
						<IndexRoute component={Thread} />
						<Route path='/about' component={About}/>
						<Route path='/r/:subreddit/comments' component={Thread}/>
						{/* <Route path='/:board/:pageNr' component={Board} />
						<Route path='/:board/thread/:thread' component={Thread}/>
						<Route component={Home} /> */}
					</Switch>
				</>			
			</BrowserRouter>
		)
	}
}