import React from 'react'

import { FormControl } from 'react-bootstrap'

module.exports =  React.createClass({

  getDefaultValue: function() {
    switch (this.props.template.type) {
      case 'color':
        return '#000000'
        break;
      default:
        return '';
    }
  },

  getInitialState: function() {
    return {id: null, value: this.getDefaultValue()};
  },

  componentDidMount: function() {
    this.setState({id: this.props.template.id, value: this.props.value});
  },

  componentWillReceiveProps: function(newProps) {
    this.setState({id: newProps.template.id, value: newProps.value});
  },

  getValidationState: function() {
    switch (this.props.template.type) {
      case 'email':
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(this.state.value) ? 'success' : 'error';
        break;
      default:
        return null;
    }
  },

  handleChange: function(event) {
    this.setState({value: event.target.value}, function() {
      this.props.handleChange(this.state);
      this.props.handleValidationState(this.getValidationState());
    });
  },

  render() {

    var attrs = {};
    for (var prop in this.props.template) {
      if (this.props.template.hasOwnProperty(prop) && !['id', 'title', 'help', 'header'].includes(prop)) {
        attrs[prop] = this.props.template[prop];
      }
    }

    return (
      <FormControl
      {...attrs}
      name={this.props.template.id}
      value={(this.state.value) ? this.state.value : this.getDefaultValue()}
      placeholder={this.props.template.placeholder}
      onChange={this.handleChange}
      />
    );

  }

})
