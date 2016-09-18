import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { browserHistory } from 'react-router'

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'
import { Grid, ButtonGroup, Button, Modal, OverlayTrigger, FormGroup, FormControl, ControlLabel, Checkbox, HelpBlock } from 'react-bootstrap'

var Users = React.createClass({
  getInitialState: function() {
    return {users: [], user: {}, selectedUsers: [], userModal: {visible: false}};
  },

  componentDidMount: function() {
    var self = this;
    $.get('/api/users', function(users){
      self.setState({users: users});
    });
  },

  closeUserModal() {
    this.setState({ userModal: {visible: false}});
  },

  openNewUserModal() {
    var userModal = this.state.userModal;
    userModal.visible = true;
    userModal.method = 'POST';
    userModal.title = this.props.intl.formatMessage({id: 'title.user.new'});
    this.setState({ user: {}, userModal: userModal });
  },

  openEditUserModal() {
    var userModal = this.state.userModal;
    userModal.visible = true;
    userModal.method = 'PUT';
    userModal.title = this.props.intl.formatMessage({id: 'title.user.edit'});
    this.setState({ user: this.state.selectedUsers[0], userModal: userModal });
  },

  handleUserChange: function(e) {
    var user = this.state.user;
    switch (e.target.type) {
      case 'checkbox':
        user[e.target.name] = e.target.checked;
        break;
      default:
        user[e.target.name] = e.target.value;
    }
    this.setState({user: user});
  },

  submitUser: function (e){
    e.preventDefault();
    var self = this;

    var data = this.state.user;

    $.ajax({
      type: this.state.userModal.method,
      url: '/api/users/',
      data: data
    })
    .done(function(data) {
      var users = self.state.users;
      if (self.state.userModal.method == 'PUT') {
        users.forEach((item, i) => {if (item._id == data._id) users[i] = data})
      } else {
        users.unshift(data);
      }
      self.setState({users: users, selectedUsers: []});
      self.closeUserModal();
    })
    .fail(function(jqXhr) {
      self.props.handleNotification({
        title: self.props.intl.formatMessage({id: 'notification.newuser.error.title'}),
        message: self.props.intl.formatMessage({id: 'notification.newuser.error.message'})
      });
    });
  },

  handleDeleteUser: function(e) {
    var self = this;

    for (var i = 0; i < this.state.selectedUsers.length; i++) {
      var user = this.state.selectedUsers[i];
      $.ajax({
        type: 'DELETE',
        url: '/api/users/' + user._id
      })
      .done(function(data) {
        var users = self.state.users.filter(function(obj) {
          return obj._id !== user._id;
        });
        self.setState({users: users, selectedUsers: []});
      })
      .fail(function(jqXhr) {
        self.props.handleNotification({
          title: self.props.intl.formatMessage({id: 'notification.deleteuser.error.title'}),
          message: self.props.intl.formatMessage({id: 'notification.deleteuser.error.message'})
        });
      });
    }
  },

  booleanFormatter(cell, row){
    return (cell) ? this.props.intl.formatMessage({id: 'table.boolean.true'}) : this.props.intl.formatMessage({id: 'table.boolean.false'});
  },

  onRowSelect(row, isSelected){
    var selectedUsers = this.state.selectedUsers;

    if (isSelected) {
      selectedUsers = []; // Remove this line for checkbox selection
      selectedUsers.push(row);
    } else {
      selectedUsers = selectedUsers.filter(function(obj) {
        return obj._id !== row._id;
      });
    }

    this.setState({selectedUsers: selectedUsers});
  },

  onSelectAll(isSelected){
    if (isSelected) {
      this.setState({selectedUsers: this.state.users});
    } else {
      this.setState({selectedUsers: []});
    }
  },

  render() {
    var selectRowProp = {
      mode: "radio",
      clickToSelect: true,
      onSelect: this.onRowSelect,
      onSelectAll: this.onSelectAll
    };

    return (
      <Grid>
        <h1><FormattedMessage id="title.users"/></h1>
        <ButtonGroup>
          <Button bsStyle="primary" onClick={this.openNewUserModal}><i className="fa fa-plus"></i> <FormattedMessage id="btn.add"/></Button>
          <Button bsStyle="warning" onClick={this.openEditUserModal} disabled={this.state.selectedUsers.length <= 0}><i className="fa fa-edit"></i> <FormattedMessage id="btn.edit"/></Button>
          <Button bsStyle="danger" onClick={this.handleDeleteUser} disabled={this.state.selectedUsers.length <= 0}><i className="fa fa-trash"></i> <FormattedMessage id="btn.delete"/></Button>
        </ButtonGroup>
        <BootstrapTable data={this.state.users} pagination={true} selectRow={selectRowProp}>
          <TableHeaderColumn dataField="username" isKey={true} dataSort={true}><FormattedMessage id="form.username"/></TableHeaderColumn>
          <TableHeaderColumn dataField="active" dataFormat={this.booleanFormatter} dataSort={true}><FormattedMessage id="form.active"/></TableHeaderColumn>
        </BootstrapTable>

        <Modal show={this.state.userModal.visible} onHide={this.closeUserModal}>
          <form action={"/api/users"} method={this.state.userModal.method} onSubmit={this.submitUser}>
            <Modal.Header closeButton>
              <Modal.Title>{this.state.userModal.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>

              <FormGroup>
                <ControlLabel><FormattedMessage id="form.username"/></ControlLabel>
                <FormControl type="text" name="username" defaultValue={this.state.user.username} onChange={this.handleUserChange} autoFocus />
              </FormGroup>
              <FormGroup>
                <ControlLabel><FormattedMessage id="form.password"/></ControlLabel>
                <FormControl type="password" name="password" disabled={this.state.userModal.method == 'PUT'} onChange={this.handleUserChange} />
              </FormGroup>
              <FormGroup>
                <Checkbox name="active" defaultChecked={this.state.user.active} onChange={this.handleUserChange}><FormattedMessage id="form.active"/></Checkbox>
              </FormGroup>

            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.closeUserModal}><i className="fa fa-times"></i> Close</Button>
              <Button type="submit" bsStyle="success"><i className="fa fa-check"></i> Save</Button>
            </Modal.Footer>
          </form>
        </Modal>
      </Grid>
    )
  }
});

module.exports = injectIntl(Users);
