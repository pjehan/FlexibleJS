import React from 'react'

import { Alert, FormGroup, ControlLabel, HelpBlock } from 'react-bootstrap'

import List from './List.jsx'
import Builder from './Builder.jsx'

import { getFormComponent } from '../../js/utils.jsx'

module.exports = React.createClass({

  render() {

    var value = this.props.component[this.props.template.id];
    var formComponent = null;

    if (this.props.template.type == 'list') {
      formComponent = (
        <List template={this.props.template} component={this.props.component} componentId={this.props.componentId} handleChange={this.props.handleChange} handleNotification={this.props.handleNotification} handleModal={this.props.handleModal}></List>
      );
    } else if (this.props.template.type == 'builder') {
      formComponent = (
        <Builder template={this.props.template} value={value} handleChange={this.props.handleChange} handleNotification={this.props.handleNotification} handleModal={this.props.handleModal}></Builder>
      );
    } else {
      formComponent = getFormComponent(this, this.props.template, value);
    }

    return (
      <FormGroup controlId={this.props.template.id}>
        <ControlLabel>{this.props.template.title}</ControlLabel>
        {formComponent}
        <HelpBlock>{this.props.template.help}</HelpBlock>
      </FormGroup>
    );

  }

})
