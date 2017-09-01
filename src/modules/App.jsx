import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'

import { addLocaleData, IntlProvider, FormattedMessage } from 'react-intl'
import en from 'react-intl/locale-data/en'
import fr from 'react-intl/locale-data/fr'
import enMessages from '../../i18n/en.json'
import frMessages from '../../i18n/fr.json'

import { Button, Nav, Navbar, NavDropdown, MenuItem, NavItem, Modal } from 'react-bootstrap'

import { OrderedSet } from 'immutable'
import { NotificationStack } from 'react-notification'

import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'

addLocaleData([...en, ...fr])

var lang = (navigator.language.indexOf('-') > 1) ? navigator.language.substring(0, navigator.language.indexOf('-')) : navigator.language
var messages
switch (lang) {
  case 'fr':
    messages = frMessages
    break
  default:
    messages = enMessages
}

var MyApp = React.createClass({

  getInitialState() {
    return { user: null, sites: [], selectedSite: null, notifications: OrderedSet(), count: 0, modal: { show: false } }
  },

  componentDidMount: function() {
    var self = this
    $.get('/api/users/currentuser', function(user) {
      self.setState({user: user})
    })
    $.get('/api/templates', function(sites) {
      var selectedSite = self.state.selectedSite
      if (!selectedSite) {
        selectedSite = sites[0]
      }
      self.setState({sites: sites, selectedSite: selectedSite})
    })

    moment.locale(navigator.language)

    NProgress.configure({ parent: 'main' })

    $(document).on('ajaxStart', function() {
      NProgress.start()
    })

    $(document).on('ajaxStop', function() {
      NProgress.done()
    })

    $(document).on('ready', function() {
      NProgress.start()
    })

    $(window).on('load', function() {
      NProgress.done()
    })
  },

  handleUser: function(user) {
    this.setState({ user: user })
  },

  handleSiteChange: function(site, event) {
    this.setState({ selectedSite: site })
  },

  handleModal: function(modal) {
    modal.show = true
    this.setState({ modal: modal })
  },

  handleModalClose: function() {
    var self = this

    // If a function is defined when the close button is clicked
    if (this.state.modal.close) {
      this.state.modal.close(function() {
        self.close()
      })
    } else {
      self.close()
    }
  },

  close() {
    this.setState({ modal: { show: false } })
  },

  addNotification: function(notification) {
    var notifications = this.state.notifications
    var newCount = this.state.count + 1

    notification['key'] = newCount
    notification['action'] = 'Dismiss'
    notification['dismissAfter'] = 3400
    notification['onDismiss'] = this.removeNotification(newCount)

    return this.setState({
      count: newCount,
      notifications: notifications.add(notification)
    })
  },

  removeNotification(count) {
    const notifications = this.state.notifications
    this.setState({
      notifications: notifications.filter(n => n.key !== count)
    })
  },

  renderChildren: function() {
    return React.Children.map(this.props.children, child =>
      React.cloneElement(child, {site: this.state.selectedSite, currentUser: this.state.user, handleNotification: this.addNotification, handleUser: this.handleUser, handleModal: this.handleModal})
    )
  },

  render() {
    var leftNav
    var rightNav
    if (this.state.user && this.state.user.active) {
      leftNav = (
        <Nav>
          <LinkContainer to="/" onlyActiveOnIndex={true}>
            <NavItem><FormattedMessage id="btn.dashboard"/></NavItem>
          </LinkContainer>
          <LinkContainer to="/pages">
            <NavItem><FormattedMessage id="btn.pages"/></NavItem>
          </LinkContainer>
          <LinkContainer to="/users">
            <NavItem><FormattedMessage id="btn.users"/></NavItem>
          </LinkContainer>
        </Nav>
      )

      var siteNodes = this.state.sites.map(function(site) {
        return (
          <MenuItem onClick={this.handleSiteChange.bind(this, site)} className={(this.state.selectedSite === site) ? 'active' : ''} key={site.id}>{site.title}</MenuItem>
        )
      }.bind(this))

      var selectedSite = (this.state.selectedSite) ? this.state.selectedSite.title : ''

      rightNav = (
        <Nav pullRight>
          <NavDropdown id="site-dropdown" title={selectedSite}>
            {siteNodes}
          </NavDropdown>
          <LinkContainer to="/settings">
            <NavItem><FormattedMessage id="btn.settings"/></NavItem>
          </LinkContainer>
          <NavDropdown id="profile-dropdown" title={this.state.user.username}>
            <MenuItem><FormattedMessage id="btn.profile"/></MenuItem>
            <LinkContainer to="/logout">
              <MenuItem><FormattedMessage id="btn.logout"/></MenuItem>
            </LinkContainer>
          </NavDropdown>
        </Nav>
      )
    } else {
      rightNav = (
        <Nav pullRight>
          <LinkContainer to="/login">
            <NavItem><FormattedMessage id="btn.login"/></NavItem>
          </LinkContainer>
          <LinkContainer to="/register">
            <NavItem><FormattedMessage id="btn.register"/></NavItem>
          </LinkContainer>
        </Nav>
      )
    }

    var modalIcon = (this.state.modal.icon) ? (<i className={'fa fa-' + this.state.modal.icon + ' fa-3x'}></i>) : ''
    var modalBody = this.state.modal.body
    if (modalIcon) {
      modalBody = (
        <div className="row">
          <div className="col-md-1">
            {modalIcon}
          </div>
          <div className="col-md-11">
            {this.state.modal.body}
          </div>
        </div>
      )
    }
    var modalButtons
    if (this.state.modal.buttons) {
      modalButtons = this.state.modal.buttons.map(function(button, index) {
        var buttonIcon = (button.icon) ? (<i className={'fa fa-' + button.icon}></i>) : ''
        return (
          <Button bsStyle={button.style} onClick={ () => { button.onClick(); this.close() } } key={index}>{buttonIcon} {button.content}</Button>
        )
      }.bind(this))
    }

    var navbarStyle = (window.location.host.startsWith('localhost')) ? 'default' : 'inverse'

    return (
      <IntlProvider locale={navigator.language} messages={messages} defaultLocale='en'>
        <div>
          <NotificationStack
            notifications={this.state.notifications.toArray()}
            onDismiss={notification => this.setState({
              notifications: this.state.notifications.delete(notification)
            })}
          />

          <Navbar bsStyle={navbarStyle} fixedTop={true}>
            <Navbar.Header>
              <Navbar.Brand>
                <a href="/" className="rubberBand animated">Flexible</a>
              </Navbar.Brand>
            </Navbar.Header>
            {leftNav}
            {rightNav}
          </Navbar>

          <main>
            {this.renderChildren()}
          </main>

          <Modal show={this.state.modal.show} onHide={this.close}>
            <Modal.Header closeButton>
              <Modal.Title>{this.state.modal.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {modalBody}
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.handleModalClose}><FormattedMessage id="btn.close"/></Button>
              {modalButtons}
            </Modal.Footer>
          </Modal>

        </div>
      </IntlProvider>
    )
  }
})

module.exports = DragDropContext(HTML5Backend)(MyApp)
