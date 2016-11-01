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

  handleChange: function(event) {
    this.setState({value: event.target.value}, function() {
      this.props.handleChange(this.state);
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
