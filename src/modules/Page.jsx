import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { LinkContainer } from 'react-router-bootstrap'

import { Grid, Row, Col, Panel, Breadcrumb, Button } from 'react-bootstrap'

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
    return {page: null, changes: false, template: null, parents: [], seo_open: false};
  },

  componentDidMount: function() {
    var self = this;
    $.get('/api/pages/' + this.props.params.id, function(page){
      if (self.props.site) {
        $.get('/api/templates/' + self.props.site.id + '/' + page.template, function(template){
          self.getPageParents(page, [], function(parents) {
            // Create object node per lang if not exists
            for (var i = 0; i < self.props.site.lang.length; i++) {
              if (!page[self.props.site.lang[i]]) {
                page[self.props.site.lang[i]] = {};
              }
            }

            self.setState({page: page, changes: false, template: template, parents: parents}, function() {
              // Save page shortcut
              $(window).bind('keydown', function(event) {
                if ((event.ctrlKey || event.metaKey) && String.fromCharCode(event.which).toLowerCase() === 's') {
                  event.preventDefault();
                  self.saveChanges();
                }
              });
            });

            // Prevent user from refreshing the page without saving current changes
            window.onbeforeunload = () => {
              if (self.state.changes) {
                return "";
              }
            }

          });
        });
      }
    });
  },

  componentDidUpdate: function() {
    // Sticky header
    $('#page-header').affix({
      offset: {
        top: 10,
        bottom: function () {
          return (this.bottom = $('.footer').outerHeight(true))
        }
      }
    });
    $('#page-header')
    .on('affix.bs.affix', function () {
      var $pageheader = $('#page-header');
      var $container = $pageheader.closest('.container');
      var $panel = $pageheader.parents('.panel');
      var $formgroup = $pageheader.next();
      var margin =  parseInt($container.css("margin-right"));
      var padding = parseInt($container.css("padding-right"));
      $pageheader.css("right",margin+padding);
      $pageheader.css("top", 64);
      $pageheader.width($panel.width());
      $formgroup.css('margin-top', 60);
    })
    .on('affix-top.bs.affix', function () {
      var $pageheader = $('#page-header');
      var $formgroup = $pageheader.next();
      $pageheader.css("right","0px");
      $pageheader.css("width","auto");
      $formgroup.css('margin-top', 0);
    });
  },

  componentWillReceiveProps: function(newProps) {
    var self = this;
    // If page changed, update state
    if (this.props.params.id != newProps.routeParams.id) {
      if (this.state.changes) {
        this.showSaveChangesModal(function() {
          self.props.params.id = newProps.routeParams.id;
          self.componentDidMount();
        });
      } else {
        this.props.params.id = newProps.routeParams.id;
        this.componentDidMount();
      }
    }
  },

  componentWillUnmount: function() {
    if (this.state.changes) {
      this.showSaveChangesModal();
    }
    window.onbeforeunload = null; // Remove prevent reloading when unsave changes
  },

  handleChange: function(data) {
    var page = this.state.page;
    if (!page[this.props.language]) {
      page[this.props.language] = {}
    }

    page[this.props.language][data.id] = data.value;
    this.setState({page: page, changes: true });
  },

  showSaveChangesModal: function(callback) {
    var self = this;

    this.props.handleModal({
      title: this.props.intl.formatMessage({id: 'modal.page.save_changes.title'}),
      body: this.props.intl.formatMessage({id: 'modal.page.save_changes.message'}),
      icon: 'exclamation-circle text-warning',
      close: function(closeCallback) {
        callback();
        closeCallback();
      },
      buttons: [
        {
          style: 'success',
          icon: 'check',
          content: 'Save',
          onClick: function () {
            self.saveChanges();
            callback();
          }
        }
      ]
    });
  },

  saveChanges: function() {
    var self = this;

    $.ajax({
      type: 'PUT',
      url: '/api/pages/' + this.state.page._id,
      data: JSON.stringify(this.state.page),
      contentType: "application/json"
    })
    .done(function(data) {
      self.setState({page: data, changes: false});
    })
    .fail(function(jqXHR, textStatus) {
      console.log(jqXHR);
      console.log(textStatus);
    });
  },

  submit: function (e){
    e.preventDefault();
    this.saveChanges();
  },

  getPageParents: function(page, parents, callback) {
    var self = this;

    if (!page.parent) {
      if (callback) {
        callback(parents.reverse());
      }
      return parents;
    }

    $.get('/api/pages/' + page.parent, function(page){
      parents.push(page);

      parents = self.getPageParents(page, parents, callback);

      return parents;
    });
  },

  render() {
    var self = this;

    if (this.state.page && this.state.template) {
      var breadcrumbNodes = self.state.parents.map(function(parent){
        return (
          <LinkContainer to={"/pages/" + parent._id} key={parent._id}>
            <Breadcrumb.Item>{parent.title}</Breadcrumb.Item>
          </LinkContainer>
        );
      }.bind(self));

      var seo = [];
      if (self.state.template.seo) {
        var seo_metadescription_template = {
          id: 'seo_metadescription',
          title: 'Meta Description',
          type: 'text'
        }
        var seo_title_template = {
          id: 'seo_title',
          title: 'Title',
          type: 'text'
        }
        seo = (
          <ExpandablePanel header="SEO">
            <Component key="seo_title" template={seo_title_template} component={self.state.page[this.props.language]} handleChange={this.handleChange}></Component>
            <Component key="seo_metadescription" template={seo_metadescription_template} component={self.state.page[this.props.language]} handleChange={this.handleChange}></Component>
          </ExpandablePanel>
        )
      }

      var componentNodes = self.state.template.components.map(function(component){
        return (
          <Component
            key={component.id}
            template={component}
            component={self.state.page[this.props.language]}
            componentId={self.state.page._id}
            handleChange={self.handleChange}
            handleNotification={this.props.handleNotification}
            handleModal={this.props.handleModal}>
          </Component>
        );
      }.bind(self));

      return (
        <div>
          <Panel>

            <form action={"api/pages/" + self.state.page._id} method="PUT" onSubmit={self.submit} encType="multipart/form-data">

              <Panel id="page-header">
                <Button type="submit" bsStyle="success" className="pull-right" disabled={!this.state.changes} title="Ctrl + S"><i className="fa fa-check"></i> Save</Button>
                <Breadcrumb>
                  {breadcrumbNodes}
                  <Breadcrumb.Item href="#" active>
                    {self.state.page.title}
                  </Breadcrumb.Item>
                </Breadcrumb>
              </Panel>

              {seo}
              {componentNodes}
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
});

module.exports = injectIntl(Page);
