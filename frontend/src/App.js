import React from 'react'
import {
  Router,
  Route
} from 'react-router-dom'
import AuthCallback from './routes/AuthCallback'
import Home from './routes/Home'

import { createBrowserHistory } from 'history'

const history = createBrowserHistory()

const App = () => (
  <Router history={history}>
    <Route exact path="/" component={Home}/>
    <Route exact path="/auth-callback" component={AuthCallback}/>
  </Router>
)

export default App
