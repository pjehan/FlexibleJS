import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { withRouter } from 'react-router'
import { browserHistory } from 'react-router'

import { Grid } from 'react-bootstrap'

var Logout = React.createClass({
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
        <p><FormattedMessage id="label.loggedout"/></p>
      </Grid>
    )
  }
})

module.exports = withRouter(injectIntl(Logout));
