import React from 'react'

import { FormControl } from 'react-bootstrap'
import select2 from 'select2';

module.exports =  React.createClass({

  getInitialState: function() {
    return {id: null, value: (this.props.template.multiple) ? [] : ''};
  },

  componentDidMount: function() {
    var self = this;

    this.setState({id: this.props.template.id, value: this.props.value});

    var self = this;
    // Because the change event is not triggered on the hidden select, we have to trigger it manually
    $('#' + this.props.template.id).select2().on('change', function(event) {
      self.handleChange(event);
    });
  },

  componentDidUpdate: function() {
    $('#' + this.props.template.id).trigger('change.select2');
  },

  componentWillReceiveProps: function(newProps) {
    this.setState({id: newProps.template.id, value: newProps.value});
  },

  handleChange: function(event) {
    var value = event.target.value;
    if (this.props.template.multiple) {
      value = $('#' + this.props.template.id).select2("val");
      if (value == null) {
        value = [];
      }
    }
    this.setState({value: value}, function() {
      this.props.handleChange(this.state);
    });
  },

  render() {

    // Exclude some JSON properties so they won't be displayed in the HTML Component
    var attrs = {};
    for (var prop in this.props.template) {
      if (this.props.template.hasOwnProperty(prop) && !['id', 'type', 'title', 'help', 'options'].includes(prop)) {
        attrs[prop] = this.props.template[prop];
      }
    }

    var optionNodes = this.props.template.options.map(function(option, index){
      return (
        <option value={option} key={index}>{option}</option>
      );
    }.bind(this));

    return (
      <FormControl
        componentClass="select"
        {...attrs}
        name={this.props.template.id}
        value={this.state.value}
        placeholder={this.props.template.placeholder}
        onChange={this.handleChange}
        >
        {optionNodes}
      </FormControl>
    );

  }

})
