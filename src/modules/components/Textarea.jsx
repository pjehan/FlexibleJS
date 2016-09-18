import React from 'react'

import { FormControl } from 'react-bootstrap'

module.exports =  React.createClass({

  getInitialState: function() {
    return {id: null, value: null};
  },

  componentDidMount: function() {
    this.setState({id: this.props.template.id, value: this.props.value});
  },

  componentWillReceiveProps: function(newProps) {
    this.setState({id: newProps.template.id, value: newProps.value});
  },

  componentWillUpdate: function(newProps, newState) {
    if (this.state.value != newState.value) {
      this.props.handleChange({
        id: newState.id,
        value: newState.value
      });
    }
  },

  handleChange: function(event) {
    this.setState({value: event.target.value});
  },

  render() {

    var attrs = {};
    for (var prop in this.props.template) {
      if (this.props.template.hasOwnProperty(prop) && !['id', 'title', 'help'].includes(prop)) {
        attrs[prop] = this.props.template[prop];
      }
    }

    return (
      <FormControl
      componentClass="textarea"
      {...attrs}
      name={this.props.template.id}
      value={(this.state.value) ? this.state.value : ''}
      placeholder={this.props.template.placeholder}
      onChange={this.handleChange}
      />
    );

  }

})
