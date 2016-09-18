import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { withRouter } from 'react-router'

import { Grid, Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'

var Login = React.createClass({

  getInitialState() {
    return {
      username: "",
      password: ""
    }
  },

  handleChange: function(event) {
    var change = {};
    change[event.target.name] = event.target.value;
    this.setState(change);
  },

  handleSubmit(event) {
    event.preventDefault()

    var data = {
      username: this.state.username,
      password: this.state.password
    };

    var self = this;
    $.ajax({
      type: 'POST',
      url: '/api/users/login',
      data: JSON.stringify(data),
      contentType: "application/json"
    })
    .done(function(user) {
      self.props.handleUser(user);
      if (user.active) {
        self.props.router.replace('/');
      } else {
        self.props.handleNotification({
          title: self.props.intl.formatMessage({id: 'notification.notactive.title'}),
          message: self.props.intl.formatMessage({id: 'notification.notactive.message'})
        });
      }
    })
    .fail(function(jqXHR, textStatus) {
      switch (jqXHR.status) {
        case 401:
        self.props.handleNotification({
          title: self.props.intl.formatMessage({id: 'notification.unauthorized.title'}),
          message: self.props.intl.formatMessage({id: 'notification.unauthorized.message'})
        });
        break;
      }
    });
  },

  render() {
    return (
      <Grid>
        <h1><FormattedMessage id="title.login"/></h1>
        <form onSubmit={this.handleSubmit}>
          <FormGroup>
            <ControlLabel><FormattedMessage id="form.username"/></ControlLabel>
            <FormControl type="text" name="username" value={this.props.username} onChange={this.handleChange} autoFocus />
          </FormGroup>
          <FormGroup>
            <ControlLabel><FormattedMessage id="form.password"/></ControlLabel>
            <FormControl type="password" name="password" value={this.props.password} onChange={this.handleChange} />
          </FormGroup>
          <Button type="submit"><i className="fa fa-sign-in"></i> <FormattedMessage id="btn.login"/></Button>
        </form>
      </Grid>
    )
  }
});

module.exports = withRouter(injectIntl(Login));
