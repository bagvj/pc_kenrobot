/* eslint flowtype-errors/show-errors: 0 */
import React from 'react'
import { Switch, Route } from 'react-router'
import App from './containers/App'
import Home from './containers/Home'
import Counter from './containers/Counter'

export default () => (
  <App>
    <Switch>
      <Route path="/counter" component={Counter} />
      <Route path="/" component={Home} />
    </Switch>
  </App>
)
