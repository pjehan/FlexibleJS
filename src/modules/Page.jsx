import React from 'react'
import { LinkContainer } from 'react-router-bootstrap'

import { Grid, Row, Col, Panel, Breadcrumb, Button } from 'react-bootstrap'

import ExpandablePanel from '../modules/ExpandablePanel.jsx'
import Component from '../modules/components/Component.jsx'

module.exports =  React.createClass({

  /**
   * page {object}: Current modified page
   * change {boolean}: Is page changed
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
      $.get('/api/templates/' + self.props.site.id + '/' + page.template, function(template){
        self.getPageParents(page, [], function(parents) {
          // Create object node per lang if not exists
          for (var i = 0; i < self.props.site.lang.length; i++) {
            if (!page[self.props.site.lang[i]]) {
              page[self.props.site.lang[i]] = {};
            }
          }
          self.setState({page: page, template: template, parents: parents});
        });
      });
    });
  },

  componentDidUpdate: function() {
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
      var $container = $('#page-header').closest('.container');
      var $panel = $('#page-header').parents('.panel');
      var margin =  parseInt($container.css("margin-right"));
      var padding = parseInt($container.css("padding-right"));
      $("#page-header").css("right",margin+padding);
      $("#page-header").css("top",50);
      $("#page-header").width($panel.width());
    })
    .on('affix-top.bs.affix', function () {
      $("#page-header").css("right","0px");
      $("#page-header").css("width","auto");
    });
  },

  componentWillReceiveProps: function(newProps) {
    // If page changed, update state
    if (this.props.params.id != newProps.routeParams.id) {
      this.props.params.id = newProps.routeParams.id;
      this.componentDidMount();
    }
  },

  componentWillUnmount: function() {
    if (this.state.changes) {
      console.log('TODO: Display alert because current changes are not saved');
    }
  },

  handleChange: function(data) {
    var page = this.state.page;
    if (!page[this.props.language]) {
      page[this.props.language] = {}
    }

    page[this.props.language][data.id] = data.value;
    this.setState({page: page, changes: true });
  },

  submit: function (e){
    e.preventDefault();
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
                <Button type="submit" bsStyle="success" className="pull-right"><i className="fa fa-check"></i> Save</Button>
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
})
