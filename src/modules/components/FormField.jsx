import React from 'react'

import { Alert, FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap'

module.exports = React.createClass({

  render() {

    var validationState = this.props.validationState ? this.props.validationState.state : null;
    var helpBlock = this.props.validationState && this.props.validationState.state != 'success' ? this.props.validationState.message : this.props.help;

    return (
      <FormGroup id={"component-" + this.props.id} controlId={this.props.id} validationState={validationState} className={"component-" + this.props.type}>
        <ControlLabel>{this.props.title}</ControlLabel>
        {this.props.children}
        <FormControl.Feedback />
        <HelpBlock>{helpBlock}</HelpBlock>
      </FormGroup>
    );

  }

})
