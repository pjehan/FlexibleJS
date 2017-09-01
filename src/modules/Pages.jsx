import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'

import { Grid, Row, Col, Button, Nav, NavItem, Modal, FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap'

import { browserHistory } from 'react-router'

var Pages = React.createClass({

  getInitialState: function() {
    return {pages: [], templates: [], page: {}, language: null, showNewPageModal: false}
  },

  componentDidMount: function() {
    this.handleSiteChange(this.props)
  },

  componentWillReceiveProps: function(nextProps) {
    if (!this.props.site || this.props.site.id !== nextProps.site.id) {
      this.handleSiteChange(nextProps)
    }
  },

  handleSiteChange: function(props) {
    if (props.site) {
      var self = this
      $.get('/api/pages/', {site_id: props.site.id})
        .done(function(result) {
          self.setState({pages: result})
          browserHistory.push('/pages') // Redirect user to pages to reset selected page
        })
      this.setState({templates: props.site.templates, language: props.site.lang[0]})
    }
  },

  handleLanguageChange: function(event) {
    this.setState({ language: event.target.value })
  },

  closeNewPageModal() {
    this.setState({ showNewPageModal: false })
  },

  openNewPageModal() {
    this.setState({ showNewPageModal: true })
  },

  handleNewPageChange: function(event) {
    var page = this.state.page
    page[event.target.id] = event.target.value
    this.setState({page: page})
  },

  submitNewPage: function(e) {
    e.preventDefault()
    var self = this

    var page = this.state.page
    page.site_id = this.props.site.id

    $.ajax({
      type: 'POST',
      url: '/api/pages/',
      data: page
    })
      .done(function(data) {
        self.closeNewPageModal()
        var pages = self.state.pages
        pages.push(data)
        self.setState({pages: pages})
      })
      .fail(function(jqXhr) {
        console.log('failed to register')
      })
  },

  handleDeletePage: function(page, e) {
    e.preventDefault()

    var self = this

    this.props.handleModal({
      title: this.props.intl.formatMessage({id: 'modal.page.delete.title'}),
      body: this.props.intl.formatMessage({id: 'modal.page.delete.message'}),
      icon: 'minus-circle text-danger',
      buttons: [
        {
          style: 'danger',
          icon: 'trash',
          content: this.props.intl.formatMessage({id: 'btn.delete'}),
          onClick: function() {
            $.ajax({
              type: 'DELETE',
              url: '/api/pages/' + page._id
            })
              .done(function(data) {
                var pages = self.state.pages.filter(function(obj) {
                  return obj._id !== page._id
                })
                self.setState({pages: pages})
              })
              .fail(function(jqXhr) {
                console.log('failed to delete page')
              })
          }
        }
      ]
    })
  },

  renderChildren: function() {
    return React.Children.map(this.props.children, child =>
      React.cloneElement(child, {currentUser: this.props.currentUser, language: this.state.language, site: this.props.site, handleNotification: this.props.handleNotification, handleModal: this.props.handleModal})
    )
  },

  render() {
    var self = this

    var superAdmin = (this.props.currentUser && this.props.currentUser.role === 'super_admin')

    var pageNodes = this.state.pages.map(function(page) {
      return (
        <LinkContainer to={'/pages/' + page._id} key={page._id}>
          <NavItem eventKey={page._id}>
            {page.title}
            <Button className={superAdmin ? 'pull-right' : 'pull-right hidden'} bsStyle="danger" bsSize="xsmall" onClick={self.handleDeletePage.bind(this, page)} >
              <i className="fa fa-trash"></i>
            </Button>
          </NavItem>
        </LinkContainer>
      )
    }.bind(this))

    var templateNodes = this.state.templates.map(function(template) {
      return (
        <option value={template.id} key={template.id}>{template.title}</option>
      )
    })

    var site
    var languageNodes
    if (this.props.site) {
      site = this.props.site.title
      languageNodes = this.props.site.lang.map(function(language) {
        return (
          <option value={language} key={language}>{language}</option>
        )
      })
    }

    return (
      <Grid>
        <Row>
          <Col sm={3}>
            <h4>{site}</h4>
            <FormControl componentClass="select" className="language-dropdown" onChange={this.handleLanguageChange}>
              {languageNodes}
            </FormControl>
            <Nav bsStyle="pills" stacked>
              {pageNodes}
            </Nav>
            <hr />
            <Button bsStyle="primary" bsSize="large" block className={superAdmin ? '' : 'hidden'} onClick={this.openNewPageModal}><i className="fa fa-plus"></i> <FormattedMessage id="btn.newpage"/></Button>

            <Modal show={this.state.showNewPageModal} onHide={this.closeNewPageModal}>
              <form action={'/api/pages'} method="POST" onSubmit={this.submitNewPage}>
                <Modal.Header closeButton>
                  <Modal.Title><FormattedMessage id="title.newpage"/></Modal.Title>
                </Modal.Header>
                <Modal.Body>

                  <FormGroup controlId="template">
                    <ControlLabel><FormattedMessage id="form.template"/></ControlLabel>
                    <FormControl
                      name="template"
                      componentClass="select"
                      placeholder="select"
                      defaultValue=""
                      required={true}
                      onChange={this.handleNewPageChange}>
                      <option disabled value=""> -- {this.props.intl.formatMessage({id: 'form.template.select'})} -- </option>
                      {templateNodes}
                    </FormControl>
                    <FormControl.Feedback />
                    <HelpBlock></HelpBlock>
                  </FormGroup>

                  <FormGroup controlId="title">
                    <ControlLabel><FormattedMessage id="form.title"/></ControlLabel>
                    <FormControl
                      type="text"
                      name="title"
                      placeholder={this.props.intl.formatMessage({id: 'form.title'})}
                      required={true}
                      onChange={this.handleNewPageChange}
                    />
                    <FormControl.Feedback />
                    <HelpBlock></HelpBlock>
                  </FormGroup>

                </Modal.Body>
                <Modal.Footer>
                  <Button onClick={this.closeNewPageModal}><i className="fa fa-times"></i> <FormattedMessage id="btn.close"/></Button>
                  <Button type="submit" bsStyle="success"><i className="fa fa-check"></i> <FormattedMessage id="btn.create"/></Button>
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

module.exports = injectIntl(Pages)
