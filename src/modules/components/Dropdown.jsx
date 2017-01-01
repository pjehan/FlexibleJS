import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'

import { FormControl } from 'react-bootstrap'

var Dropdown = React.createClass({

  getInitialState: function() {
    return {id: null, options: [], value: []};
  },

  componentDidMount: function() {
    var self = this;
    var options = [];

      if (this.props.template.relation) {
        $.ajax({
          method: 'GET',
          url: '/api/pages/dropdown/' + this.props.language + '/' + this.props.site.id,
          data: {templates: this.props.template.options}
        }).done(function(options){
          this.setState({id: this.props.template.id, options: options, value: this.props.value});
        }.bind(this));
      } else {
        for (var i = 0; i < this.props.template.options.length; i++) {
          options.push({
            value: this.props.template.options[i],
            text: this.props.template.options[i]
          });
        }
        this.setState({id: this.props.template.id, options: options, value: this.props.value});
      }

    var self = this;
    // Because the change event is not triggered on the hidden select, we have to trigger it manually
    $('#' + this.props.template.id).select2({
      placeholder: this.props.template.placeholder,
      allowClear: !this.props.template.required
    }).on('change', function(event) {
      self.handleChange(event);
    });
  },

  componentDidUpdate: function(prevProps, nextProps) {
    $('#' + this.props.template.id).trigger('change.select2');
  },

  getValidationState: function() {
    if (this.props.template.required && (!this.state.value || this.state.value.length == 0)) {
      return {state: 'error', message: this.props.intl.formatMessage({id: 'validation.required'})};
    }
    return {state: 'success'};
  },

  componentWillReceiveProps: function(newProps) {
    this.setState({id: newProps.template.id, value: newProps.value});
  },

  handleChange: function(event) {
    var value = [event.target.value];
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
      if (this.props.template.hasOwnProperty(prop) && !['id', 'type', 'title', 'help', 'options', 'relation'].includes(prop)) {
        attrs[prop] = this.props.template[prop];
      }
    }

    var optionNodes = this.state.options.map(function(option, index){
      return (
        <option value={option.value} key={index}>{option.text}</option>
      );
    }.bind(this));

    var value = (this.props.template.multiple) ? this.state.value : (this.state.value) ? this.state.value[0] : [];

    return (
      <FormControl
        componentClass="select"
        {...attrs}
        name={this.props.template.id}
        value={value}
        placeholder={this.props.template.placeholder}
        onChange={this.handleChange}
        >
        <option></option>
        {optionNodes}
      </FormControl>
    );

  }

})

module.exports = injectIntl(Dropdown);
