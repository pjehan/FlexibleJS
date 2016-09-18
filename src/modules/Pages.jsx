import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'

import { Grid, Row, Col, Button, Nav, NavItem, Modal, OverlayTrigger, FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap'

import { browserHistory } from 'react-router'

module.exports = React.createClass({

  getInitialState: function() {
    return {pages: [], templates: [], page: {}, showNewPageModal: false};
  },

  componentDidMount: function() {
    var self = this;
    $.get('/api/pages', function(result){
      self.setState({pages: result});
    });
    $.get('/api/templates', function(result){
      self.setState({templates: result});
    });
  },

  closeNewPageModal() {
    this.setState({ showNewPageModal: false });
  },

  openNewPageModal() {
    this.setState({ showNewPageModal: true });
  },

  handleNewPageChange: function(event) {
    var page = this.state.page;
    page[event.target.id] = event.target.value;
    this.setState({page: page});
  },

  submitNewPage: function (e){
    e.preventDefault();
    var self = this;

    $.ajax({
      type: 'POST',
      url: '/api/pages/',
      data: this.state.page
    })
    .done(function(data) {
      self.closeNewPageModal();
      var pages = self.state.pages;
      pages.push(data);
      self.setState({pages: pages});
    })
    .fail(function(jqXhr) {
      console.log('failed to register');
    });
  },

  handleDeletePage: function(page, e) {
    e.preventDefault();

    var self = this;

    this.props.handleModal({
      title: 'Delete this page?',
      body: 'Are you sur you want to delete this page? This action is not reversible.',
      icon: 'minus-circle text-danger',
      buttons: [
        {
          style: 'danger',
          icon: 'trash',
          content: 'Delete',
          onClick: function () {
            $.ajax({
              type: 'DELETE',
              url: '/api/pages/' + page._id
            })
            .done(function(data) {
              var pages = self.state.pages.filter(function(obj) {
                return obj._id !== page._id;
              });
              self.setState({pages: pages});
            })
            .fail(function(jqXhr) {
              console.log('failed to delete page');
            });
          }
        }
      ]
    });
  },

  renderChildren: function() {
    return React.Children.map(this.props.children, child =>
      React.cloneElement(child, {handleNotification: this.props.handleNotification, handleModal: this.props.handleModal})
    );
  },

  render() {
    var self = this;

    var pageNodes = this.state.pages.map(function(page){
      return (
        <LinkContainer to={"/pages/" + page._id} key={page._id}>
          <NavItem eventKey={page._id}>
            {page.title}
            <Button className="pull-right" bsStyle="danger" bsSize="xsmall" onClick={self.handleDeletePage.bind(this, page)}>
              <i className="fa fa-trash"></i>
            </Button>
          </NavItem>
        </LinkContainer>
      );
    }.bind(this));

    var templateNodes = this.state.templates.map(function(template){
      return (
        <option value={template.id} key={template.id}>{template.title}</option>
      );
    }.bind(this));

    return (
      <Grid>
        <Row>
          <Col sm={3}>
            <h1>Pages</h1>
            <Nav bsStyle="pills" stacked>
              {pageNodes}
            </Nav>
            <hr />
            <Button bsStyle="primary" bsSize="large" block onClick={this.openNewPageModal}><i className="fa fa-plus"></i> Add New Page</Button>

            <Modal show={this.state.showNewPageModal} onHide={this.closeNewPageModal}>
              <form action={"/api/pages"} method="POST" onSubmit={this.submitNewPage}>
                <Modal.Header closeButton>
                  <Modal.Title>Add New Page</Modal.Title>
                </Modal.Header>
                <Modal.Body>

                  <FormGroup controlId="template">
                    <ControlLabel>Template</ControlLabel>
                    <FormControl
                      name="template"
                      componentClass="select"
                      placeholder="select"
                      defaultValue=""
                      required={true}
                      onChange={this.handleNewPageChange}>
                      <option disabled value=""> -- Select a template -- </option>
                      {templateNodes}
                    </FormControl>
                    <FormControl.Feedback />
                    <HelpBlock></HelpBlock>
                  </FormGroup>

                  <FormGroup controlId="title">
                    <ControlLabel>Title</ControlLabel>
                    <FormControl
                      type="text"
                      name="title"
                      placeholder="Title"
                      required={true}
                      onChange={this.handleNewPageChange}
                      />
                    <FormControl.Feedback />
                    <HelpBlock></HelpBlock>
                  </FormGroup>

                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={this.closeNewPageModal}><i className="fa fa-times"></i> Close</Button>
                  <Button type="submit" bsStyle="success"><i className="fa fa-check"></i> Create</Button>
                </Modal.Footer>
              </form>
            </Modal>
          </Col>
          <Col sm={9}>
            {this.renderChildren()}
          </Col>
        </Row>
      </Grid>
    )
  }
})
