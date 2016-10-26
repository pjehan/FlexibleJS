import React from 'react'
import { Panel, Button } from 'react-bootstrap'

module.exports =  React.createClass({

  getInitialState: function() {
    return {open: this.props.open};
  },

  render() {
    const header = (
      <div>
        {this.props.header}
        <Button className="pull-right" bsSize="xsmall" onClick={()=> this.setState({ open: !this.state.open })}><i className={(this.state.open) ? 'fa fa-arrow-up' : 'fa fa-arrow-down'}></i></Button>
      </div>
    );

    // Add a property on each component to define if the component is visible (panel expanded) or not (panel collapsed)
    const childrenWithProps = React.Children.map(this.props.children,
     (child) => React.cloneElement(child, {
       visible: this.state.open
     })
   );

    return (
      <Panel collapsible expanded={this.state.open} id={this.props.id} header={header} onEntered={this.handleEntered}>
        {childrenWithProps}
      </Panel>
    );

  }

})
