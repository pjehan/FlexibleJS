import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'

import { FormControl } from 'react-bootstrap'

var Input = React.createClass({

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
    this.setState({id: this.props.template.id, value: this.props.value}, () => {
      if (this.props.handleValidationState) {
        this.props.handleValidationState(this.getValidationState());
      }
    });
  },

  componentWillReceiveProps: function(newProps) {
    this.setState({id: newProps.template.id, value: newProps.value});
  },

  componentDidUpdate(prevProps, nextProps) {
    if (prevProps.value != nextProps.value) {
      if (this.props.handleValidationState) {
        this.props.handleValidationState(this.getValidationState());
      }
    }
  },

  getValidationState: function() {
    if (this.props.template.required && !this.state.value) {
      return {state: 'error', message: this.props.intl.formatMessage({id: 'validation.required'})};
    }
    switch (this.props.template.type) {
      case 'email':
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!re.test(this.state.value)) {
          return {state: 'error', message: this.props.intl.formatMessage({id: 'validation.input.email'})};
        }
        break;
    }
    return {state: 'success'};
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
      {...attrs}
      name={this.props.template.id}
      value={(this.state.value) ? this.state.value : this.getDefaultValue()}
      placeholder={this.props.template.placeholder}
      onChange={this.handleChange}
      />
    );

  }

})

module.exports = injectIntl(Input);
