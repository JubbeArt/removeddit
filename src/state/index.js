import React from 'react'
import { Subscribe, Container } from 'unstated'
import { get, put } from '../utils'

// Sort types for comments
export const sort = {
  top: 'SORT_TOP',
  bottom: 'SORT_BOTTOM',
  new: 'SORT_NEW',
  old: 'SORT_OLD'
}

// Filter types for comments
export const filter = {
  all: 'SHOW_ALL',
  removedDeleted: 'SHOW_REMOVED_DELETED',
  removed: 'SHOW_REMOVED',
  deleted: 'SHOW_DELETED'
}

// Keys for localStorage
const sortKey = 'commentSort'
const filterKey = 'commentFilter'

class GlobalState extends Container {
  constructor () {
    super()

    this.state = {
      commentSort: get(sortKey, sort.top),
      commentFilter: get(filterKey, filter.removedDeleted),
      statusText: '',
      statusImage: undefined
    }
  }

  setCommentSort (sortType) {
    put(sortKey, sortType)
    this.setState({commentSort: sortType})
  }

  setCommentFilter (filterType) {
    put(filterKey, filterType)
    this.setState({commentFilter: filterType})
  }

  setError (text) {
    this.setState({statusText: text, statusImage: '/images/error.png'})
  }

  setSuccess () {
    this.setState({statusText: '', statusImage: '/images/success.png'})
  }

  setLoading (text) {
    this.setState({statusText: text, statusImage: '/images/loading.gif'})
  }

  clearStatus () {
    this.setState({statusText: '', statusImage: undefined})
  }
}

// A redux-like connect function for Unstated
export const connect = Component => {
  return props => (
    <Subscribe to={[GlobalState]}>
      {gloablState => <Component {...props} global={gloablState} />}
    </Subscribe>
  )
}
