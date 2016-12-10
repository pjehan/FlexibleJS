import React from 'react'
import ReactDOM from 'react-dom'
import { Router, Route, browserHistory, IndexRoute } from 'react-router'

import App from '../modules/App.jsx'
import Login from '../modules/account/Login.jsx'
import Logout from '../modules/account/Logout.jsx'
import Register from '../modules/account/Register.jsx'
import Dashboard from '../modules/Dashboard.jsx'
import Pages from '../modules/Pages.jsx'
import Page from '../modules/Page.jsx'
import Users from '../modules/Users.jsx'
import Settings from '../modules/Settings.jsx'

function requireAuth(nextState, replace, callback) {
  $.get('/api/users/currentuser', function(user, statusText, xhr) {
    if (xhr.status != 200 || user === undefined || !user.active) {
      replace({
        pathname: '/login',
        state: { nextPathname: nextState.location.pathname }
      });
    }
    callback();
  });

}

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <Route path="login" component={Login} />
      <Route path="logout" component={Logout} />
      <Route path="register" component={Register} />
      <IndexRoute component={Dashboard} onEnter={requireAuth}/>
      <Route path="/pages" component={Pages} onEnter={requireAuth}>
        <Route path="/pages/:id" component={Page} onEnter={requireAuth}/>
      </Route>
      <Route path="users" component={Users} onEnter={requireAuth}/>
      <Route path="settings" component={Settings} onEnter={requireAuth}/>
    </Route>
  </Router>
  , document.getElementById('app'))
