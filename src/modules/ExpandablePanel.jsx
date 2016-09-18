import React from 'react'
import { Panel, Button } from 'react-bootstrap'

module.exports =  React.createClass({

  getInitialState: function() {
    return {open: false};
  },

  render() {

    var header = (
      <div>
        {this.props.header}
        <Button className="pull-right" bsSize="xsmall" onClick={()=> this.setState({ open: !this.state.open })}><i className={(this.state.open) ? 'fa fa-arrow-up' : 'fa fa-arrow-down'}></i></Button>
      </div>
    )

    return (
      <Panel collapsible expanded={this.state.open} header={header}>
        {this.props.children}
      </Panel>
    );

  }

})
