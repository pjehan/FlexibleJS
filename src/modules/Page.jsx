import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'

import { Panel, Breadcrumb, Button, ButtonGroup } from 'react-bootstrap'

import ExpandablePanel from '../modules/ExpandablePanel.jsx'
import Component from '../modules/components/Component.jsx'

var Page = React.createClass({

  /**
  * page {object}: Current modified page
  * changes {boolean}: Is page changed
  * template {object}: Current page template
  * parents {array}: Parents pages (used for breadcrumb)
  * seo_open {boolean}: If true, display SEO form
  */
  getInitialState: function() {
    return {page: null, changes: false, components: [], template: null, parents: [], seo_open: false}
  },

  componentDidMount: function() {
    var self = this
    this.ajaxGetPage = $.get('/api/pages/' + this.props.params.id, function(page) {
      if (self.props.site) {
        this.ajaxGetTemplate = $.get('/api/templates/' + self.props.site.id + '/' + page.template, function(template) {
          self.getPageParents(page, [], function(parents) {
            // Create object node per lang if not exists
            for (var i = 0; i < self.props.site.lang.length; i++) {
              if (!page[self.props.site.lang[i]]) {
                page[self.props.site.lang[i]] = {}
              }
            }

            self.setState({page: page, changes: false, template: template, parents: parents}, function() {
              // Save page shortcut
              $(window).bind('keydown', function(event) {
                if ((event.ctrlKey || event.metaKey) && String.fromCharCode(event.which).toLowerCase() === 's') {
                  event.preventDefault()
                  self.saveChanges()
                }
              })
            })

            // Prevent user from refreshing the page without saving current changes
            window.onbeforeunload = () => {
              if (self.state.changes) {
                return ''
              }
            }
          })
        })
      }
    })
  },

  componentWillUnmount: function() {
    this.ajaxGetPage.abort()
    this.ajaxGetTemplate.abort()
    this.ajaxGetParents.abort()

    if (this.state.changes) {
      this.showSaveChangesModal()
    }
    window.onbeforeunload = null // Remove prevent reloading when unsave changes
  },

  componentDidUpdate: function() {
    // Sticky header
    $('#page-header').affix({
      offset: {
        top: 10,
        bottom: function() {
          return (this.bottom = $('.footer').outerHeight(true))
        }
      }
    })
    $('#page-header')
      .on('affix.bs.affix', function() {
        var $pageheader = $('#page-header')
        var $container = $pageheader.closest('.container')
        var $panel = $pageheader.parents('.panel')
        var $formgroup = $pageheader.next()
        var margin = parseInt($container.css('margin-right'))
        var padding = parseInt($container.css('padding-right'))
        $pageheader.css('right', margin + padding)
        $pageheader.css('top', 64)
        $pageheader.width($panel.width())
        $formgroup.css('margin-top', 60)
      })
      .on('affix-top.bs.affix', function() {
        var $pageheader = $('#page-header')
        var $formgroup = $pageheader.next()
        $pageheader.css('right', '0px')
        $pageheader.css('width', 'auto')
        $formgroup.css('margin-top', 0)
      })
  },

  componentWillReceiveProps: function(newProps) {
    var self = this
    // If page changed, update state
    if (this.props.params.id !== newProps.routeParams.id) {
      if (this.state.changes) {
        this.showSaveChangesModal(function() {
          self.props.params.id = newProps.routeParams.id
          self.componentDidMount()
        })
      } else {
        this.props.params.id = newProps.routeParams.id
        this.componentDidMount()
      }
    }
  },

  handleChange: function(data) {
    var page = this.state.page
    if (!page[this.props.language]) {
      page[this.props.language] = {}
    }

    page[this.props.language][data.id] = data.value
    this.setState({ page: page, changes: true })
  },

  handlePageChange: function(data) {
    var page = this.state.page
    page[data.id] = data.value
    this.setState({ page: page, changes: true })
  },

  handleValid: function(id, valid) {
    var components = this.state.components
    if (!components[id]) {
      components[id] = {}
    }
    components[id].valid = valid
    this.setState({components: components})
  },

  showSaveChangesModal: function(callback) {
    var self = this

    this.props.handleModal({
      title: this.props.intl.formatMessage({id: 'modal.page.save_changes.title'}),
      body: this.props.intl.formatMessage({id: 'modal.page.save_changes.message'}),
      icon: 'exclamation-circle text-warning',
      close: function(closeCallback) {
        if (callback) {
          callback()
        }
        closeCallback()
      },
      buttons: [
        {
          style: 'success',
          icon: 'check',
          content: this.props.intl.formatMessage({id: 'btn.save'}),
          onClick: function() {
            self.saveChanges()
            if (callback) {
              callback()
            }
          }
        }
      ]
    })
  },

  saveChanges: function() {
    var self = this

    var valid = true
    var components = this.state.components
    for (var property in components) {
      if (components.hasOwnProperty(property)) {
        if (!components[property].valid) {
          valid = false
          $('#component-' + property).animateCss('shake')
        }
      }
    }

    if (valid) {
      $.ajax({
        type: 'PUT',
        url: '/api/pages/' + this.state.page._id,
        data: JSON.stringify(this.state.page),
        contentType: 'application/json'
      })
        .done(function(data) {
          self.setState({page: data, changes: false})
        })
        .fail(function(jqXHR, textStatus) {
          console.log(jqXHR)
          console.log(textStatus)
        })
    }
  },

  submit: function(e) {
    e.preventDefault()
    this.saveChanges()
  },

  getPageParents: function(page, parents, callback) {
    var self = this

    if (!page.parent) {
      if (callback) {
        callback(parents.reverse())
      }
      return parents
    }

    this.ajaxGetParents = $.get('/api/pages/' + page.parent, function(page) {
      parents.push(page)

      parents = self.getPageParents(page, parents, callback)

      return parents
    })
  },

  render() {
    var self = this

    if (this.state.page && this.state.template) {
      var breadcrumbNodes = self.state.parents.map(function(parent) {
        return (
          <LinkContainer to={'/pages/' + parent._id} key={parent._id}>
            <Breadcrumb.Item>{parent.title}</Breadcrumb.Item>
          </LinkContainer>
        )
      })

      var pageNameTemplate = {
        id: 'title',
        title: this.props.intl.formatMessage({id: 'form.pagename'}),
        type: 'text'
      }
      var pageName = (
        <Component key="page_title" template={pageNameTemplate} component={this.state.page} handleChange={this.handlePageChange}></Component>
      )

      var seo = []
      if (self.state.template.seo) {
        var seoSlugTemplate = {
          id: 'slug',
          title: this.props.intl.formatMessage({id: 'form.seo.slug'}),
          type: 'text',
          required: true,
          pattern: '^([a-z0-9-]*)$',
          help: this.props.intl.formatMessage({id: 'form.help.seo.slug'})
        }
        var seoTitleTemplate = {
          id: 'seo_title',
          title: this.props.intl.formatMessage({id: 'form.seo.title'}),
          type: 'text',
          help: this.props.intl.formatMessage({id: 'form.help.seo.title'})
        }
        var seoMetadescriptionTemplate = {
          id: 'seo_metadescription',
          title: this.props.intl.formatMessage({id: 'form.seo.metadescription'}),
          type: 'textarea',
          help: this.props.intl.formatMessage({id: 'form.help.seo.metadescription'})
        }
        seo = (
          <ExpandablePanel header="SEO">
            <Component key="slug" site={this.props.site} template={seoSlugTemplate} component={this.state.page} handleChange={this.handlePageChange} handleValid={this.handleValid}></Component>
            <Component key="seo_title" template={seoTitleTemplate} component={this.state.page[this.props.language]} handleChange={this.handleChange} handleValid={this.handleValid}></Component>
            <Component key="seo_metadescription" template={seoMetadescriptionTemplate} component={this.state.page[this.props.language]} handleChange={this.handleChange} handleValid={this.handleValid}></Component>
          </ExpandablePanel>
        )
      }

      var componentNodes
      var sectionNodes

      if (this.state.template.components) {
        componentNodes = this.state.template.components.map(function(component) {
          return (
            <Component
              key={component.id}
              visible={true}
              currentUser={this.props.currentUser}
              template={component}
              site={this.props.site}
              language={this.props.language}
              component={this.state.page[this.props.language]}
              componentId={this.state.page._id}
              handleChange={this.handleChange}
              handleValid={this.handleValid}
              handleNotification={this.props.handleNotification}
              handleModal={this.props.handleModal}>
            </Component>
          )
        }.bind(this))
      }

      if (this.state.template.sections) {
        sectionNodes = this.state.template.sections.map(function(section) {
          var sectionComponentNodes = section.components.map(function(component) {
            return (
              <Component
                key={component.id}
                visible={section.open}
                currentUser={this.props.currentUser}
                template={component}
                site={this.props.site}
                language={this.props.language}
                component={this.state.page[this.props.language]}
                componentId={this.state.page._id}
                handleChange={this.handleChange}
                handleValid={this.handleValid}
                handleNotification={this.props.handleNotification}
                handleModal={this.props.handleModal}>
              </Component>
            )
          }.bind(this))
          return (
            <ExpandablePanel id={section.id} header={section.title} open={section.open} key={section.id}>
              {sectionComponentNodes}
            </ExpandablePanel>
          )
        }.bind(this))
      }

      return (
        <div>
          <Panel>

            <form action={'api/pages/' + self.state.page._id} method="PUT" onSubmit={self.submit} encType="multipart/form-data" noValidate>

              <Panel id="page-header">
                <ButtonGroup className="pull-right">
                  <a href={this.props.site.url + '/' + this.props.site.lang + '/' + this.state.page.slug} target="_blank" disabled={!this.state.template.seo} className="btn btn-primary"><i className="fa fa-external-link"></i> <FormattedMessage id="btn.open"/></a>
                  <Button type="submit" bsStyle="success" disabled={!this.state.changes} title="Ctrl + S"><i className="fa fa-check"></i> <FormattedMessage id="btn.save"/></Button>
                </ButtonGroup>
                <Breadcrumb>
                  {breadcrumbNodes}
                  <Breadcrumb.Item href="#" active>
                    {self.state.page.title}
                  </Breadcrumb.Item>
                </Breadcrumb>
              </Panel>

              {pageName}
              {seo}
              {componentNodes}
              {sectionNodes}
            </form>

          </Panel>
        </div>
      )
    }
    return (
      <div>
        Loading...
      </div>
    )
  }
})

module.exports = injectIntl(Page)
