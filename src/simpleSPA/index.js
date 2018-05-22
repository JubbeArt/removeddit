import Navigo from 'navigo'
import { render, html } from 'lit-html/lib/lit-extended'
import { createStore } from './store'

export default ({
  baseURL = window.location.origin,
  hash = '#',
  useHash = false,
  initState = {},
  persistentState = [],
  routes = {},
  stateLogger,
  element = document.getElementById('root')
}) => {
  const store = createStore({
    template: html``,
    ...initState
  }, persistentState, stateLogger)

  const router = new Navigo(baseURL, useHash, hash)

  const renderPage = () => {
    const {template, title} = store.getState()

    if (typeof template === 'function') {
      render(template(store.getState(), store.setState), element)
    } else {
      // WARNING: html`` might be a function....
      render(template, element)
    }

    if (title) {
      document.title = title
    }

    router.updatePageLinks()
  }
  // Re-render page whenever state is changed
  store.subscribe(() => renderPage())

  const navigoRoutes = {}
  Object.keys(routes).forEach(route => {
    navigoRoutes[route] = (params = {}) => routes[route](params, store.setState)
  })
  router.on(navigoRoutes).resolve()

  return {
    router, store
  }
}
