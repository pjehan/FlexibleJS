import React from 'react'

import { FormControl } from 'react-bootstrap'

import randomstring from 'randomstring';

module.exports =  React.createClass({

  getInitialState: function() {
    return {id: this.props.template.id, value: this.props.value, wysiwyg: null, elementClass: randomstring.generate({length: 8, charset: 'alphabetic'})};
  },

  componentDidMount: function() {
    var wysiwyg = $('textarea.' + this.state.elementClass);

    this.setState({wysiwyg: wysiwyg});

    wysiwyg.summernote({
      lang: 'fr-FR',
      height: 250,
      dialogsInBody: true,
      toolbar: [
        ['style', ['style']],
        ['font', ['bold', 'underline', 'clear']],
        ['para', ['ul', 'ol', 'paragraph']],
        ['color', ['color']],
        ['table', ['table']],
        ['insert', ['link', 'picture', 'video']],
        ['view', ['fullscreen', 'codeview']]
      ]
    });

    wysiwyg.on('summernote.keyup', () => {
      this.setState({value: this.state.wysiwyg.summernote('code')}, function() {
        this.props.handleChange(this.state);
      });
    });
  },

  componentWillReceiveProps: function(newProps) {
    this.setState({id: newProps.template.id, value: newProps.value}, () => {
      // Check if content has been updated from parent component
      if (newProps.value != this.state.wysiwyg.summernote("code")) {
        this.state.wysiwyg.summernote("code", this.state.value);
      }
    });
  },

  handleChange: function(value) {
    this.setState({value: value}, function() {
      this.props.handleChange(this.state);
    });
  },

  render() {
    var attrs = {};
    for (var prop in this.props.template) {
      if (this.props.template.hasOwnProperty(prop) && !['id', 'title', 'type', 'help', 'header'].includes(prop)) {
        attrs[prop] = this.props.template[prop];
      }
    }

    return (
      <FormControl
        componentClass="textarea"
        {...attrs}
        bsClass={this.state.elementClass}
        name={this.props.template.id}
        value={(this.state.value) ? this.state.value : ''}
        placeholder={this.props.template.placeholder}
        onChange={this.handleChange}
        />
    );

  }

})
