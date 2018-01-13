import React from 'react'
import {Link} from 'react-router-dom'
import StatusBox from 'components/StatusBox'
import { setStatusLoading, setStatusSuccess, setStatusError } from 'state'
import {connect} from 'react-redux'

class Menu extends React.Component {
	render () {
		return (
			<header>
				<div id='header'>
					<h1>
						<Link to='/'>Removeddit</Link>
					</h1>
					<nav>
						<Link to='/r/all'>/r/all</Link>
						<Link to='/about/'>about</Link>
					</nav>
				</div>
				<StatusBox {...this.props.status} />
			</header>
		)
	}
}

const mapStateToProps = (state) => {
	return {
		status: state.status
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		 setStatusSuccess: text => dispatch(setStatusSuccess(text)),
		 setStatusLoading: text => dispatch(setStatusLoading(text)),
		 setStatusError: text => dispatch(setStatusError(text)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Menu)