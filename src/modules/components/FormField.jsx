import React from 'react'

import { Alert, FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap'

module.exports = React.createClass({

  render() {

    return (
      <FormGroup controlId={this.props.id} validationState={this.props.validationState} className={"component-" + this.props.type}>
        <ControlLabel>{this.props.title}</ControlLabel>
        {this.props.children}
        <FormControl.Feedback />
        <HelpBlock>{this.props.help}</HelpBlock>
      </FormGroup>
    );

  }

})
