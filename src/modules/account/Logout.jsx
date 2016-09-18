import React from 'react'
import { browserHistory } from 'react-router'

import { Grid } from 'react-bootstrap'

module.exports =  React.createClass({
  componentDidMount() {
    var self = this;
    $.get('/api/users/logout', function() {
      self.props.handleUser(null);
      setTimeout(function() {
        browserHistory.push('/login');
      }, 3000)
    });
  },

  render() {
    return (
      <Grid>
        <p>You are now logged out</p>
      </Grid>
    )
  }
})
