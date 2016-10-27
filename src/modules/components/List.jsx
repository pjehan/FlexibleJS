import React from 'react'

import ListPage from './ListPage.jsx';
import ListBloc from './ListBloc.jsx';

module.exports =  React.createClass({

  getInitialState: function() {
    return {page: false, values: []};
  },

  componentDidMount: function() {
    if (this.state.page) {
      this.setState({page: this.props.template.page, values: []});
    } else {
      this.setState({page: this.props.template.page});
    }
  },

  componentWillReceiveProps: function(newProps) {
    this.setState({page: newProps.template.page});
  },

  render() {

    if (this.state.page) {
      return (<ListPage site={this.props.site} template={this.props.template} component={this.props.component} componentId={this.props.componentId} handleChange={this.props.handleChange} handleNotification={this.props.handleNotification} handleModal={this.props.handleModal}></ListPage>)
    } else {
      return (<ListBloc site={this.props.site} template={this.props.template} component={this.props.component} componentId={this.props.componentId} handleChange={this.props.handleChange} handleNotification={this.props.handleNotification} handleModal={this.props.handleModal}></ListBloc>)
    }

  }

})
