import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { withRouter } from 'react-router'

import { Grid, Button, FormGroup, FormControl, ControlLabel } from 'react-bootstrap'

var Register = React.createClass({

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
      url: '/api/users/register',
      data: JSON.stringify(data),
      contentType: "application/json"
    })
    .done(function(user) {
      self.props.handleNotification({
        title: self.props.intl.formatMessage({id: 'notification.newuser.title'}),
        message: self.props.intl.formatMessage({id: 'notification.newuser.message'})
      });
    })
    .fail(function(jqXHR, textStatus) {
      self.props.handleNotification({
        title: self.props.intl.formatMessage({id: jqXHR.responseJSON.title}),
        message: self.props.intl.formatMessage({id: jqXHR.responseJSON.message}, {username: data.username})
      });
    });
  },

  render() {
    return (
      <Grid>
        <h1><FormattedMessage id="title.register"/></h1>
        <form onSubmit={this.handleSubmit}>
          <FormGroup>
            <ControlLabel><FormattedMessage id="form.username"/></ControlLabel>
            <FormControl type="text" name="username" value={this.props.username} onChange={this.handleChange} />
          </FormGroup>
          <FormGroup>
            <ControlLabel><FormattedMessage id="form.password"/></ControlLabel>
            <FormControl type="password" name="password" value={this.props.password} onChange={this.handleChange} />
          </FormGroup>
          <Button type="submit"><i className="fa fa-user-plus"></i> <FormattedMessage id="btn.register"/></Button>
        </form>
      </Grid>
    )
  }
});

module.exports = withRouter(injectIntl(Register));
