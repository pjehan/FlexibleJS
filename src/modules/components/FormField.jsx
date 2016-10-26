import React from 'react'

import { Alert, FormGroup, ControlLabel, HelpBlock } from 'react-bootstrap'

module.exports = React.createClass({

  render() {

    return (
      <FormGroup controlId={this.props.id}>
        <ControlLabel>{this.props.title}</ControlLabel>
        {this.props.children}
        <HelpBlock>{this.props.help}</HelpBlock>
      </FormGroup>
    );

  }

})
