import React from 'react'

import { FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap'

module.exports = React.createClass({

  render() {
    var superAdmin = (this.props.currentUser && this.props.currentUser.role === 'super_admin')

    var validationState = this.props.validationState ? this.props.validationState.state : null
    var helpBlock = this.props.validationState && this.props.validationState.state !== 'success' ? this.props.validationState.message : this.props.help

    return (
      <FormGroup id={'component-' + this.props.id} controlId={this.props.id} validationState={validationState} className={'component-' + this.props.type}>
        <span className={superAdmin ? 'label label-default pull-right' : 'label label-default pull-right hidden'}>{this.props.id}</span>
        <ControlLabel>
          {this.props.title}
        </ControlLabel>
        {this.props.children}
        <FormControl.Feedback />
        <HelpBlock>{helpBlock}</HelpBlock>
      </FormGroup>
    )
  }

})
