import React from 'react'

import FormField from './FormField.jsx'
import List from './List.jsx'
import Builder from './Builder.jsx'

import { getFormComponent } from '../../js/utils.jsx'

module.exports = React.createClass({

  getInitialState: function() {
    return {validationState: null}
  },

  handleValidationState: function(validationState) {
    this.setState({validationState: validationState})
    if (this.props.handleValid) {
      var valid = validationState.state !== 'error'
      this.props.handleValid(this.props.template.id, valid)
    }
  },

  render() {
    var value = this.props.component[this.props.template.id]
    var formComponent = null

    if (this.props.template.type === 'list') {
      formComponent = (
        <List site={this.props.site} template={this.props.template} component={this.props.component} componentId={this.props.componentId} handleChange={this.props.handleChange} handleNotification={this.props.handleNotification} handleModal={this.props.handleModal}></List>
      )
    } else if (this.props.template.type === 'builder') {
      formComponent = (
        <Builder template={this.props.template} value={value} handleChange={this.props.handleChange} handleNotification={this.props.handleNotification} handleModal={this.props.handleModal}></Builder>
      )
    } else {
      formComponent = getFormComponent(this, this.props.template, this.props.component, value, this.props.visible)
    }

    return (
      <FormField id={this.props.template.id} currentUser={this.props.currentUser} type={this.props.template.type} title={this.props.template.title} help={this.props.template.help} validationState={this.state.validationState}>
        {formComponent}
      </FormField>
    )
  }

})
