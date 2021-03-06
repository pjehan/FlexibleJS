import React from 'react'

import FormField from './FormField.jsx'
import { getFormComponent } from '../../js/utils.jsx'

import ExpandablePanel from '../ExpandablePanel.jsx'

import { Button } from 'react-bootstrap'

module.exports = React.createClass({

  getInitialState: function() {
    return {value: null, components: []}
  },

  componentDidMount: function() {
    this.setState({value: this.props.value, components: this.props.components})
  },

  componentWillReceiveProps: function(newProps) {
    this.setState({value: newProps.value, components: this.props.components})
  },

  render() {
    if (!this.state.value) {
      return (<div></div>)
    }

    var headerText = 'Template ' + this.props.template.id + ' doesn\'t have a toString property'

    const componentNodes = this.state.components.map(function(component, index) {
      if (component.id === this.props.template.toString) {
        if (!this.state.value[component.id]) {
          headerText = ''
        } else if (component.type === 'image') {
          headerText = (
            <img src={ '/uploads/' + this.state.value[component.id][0].src + '?resize=20,20' } />
          )
        } else {
          headerText = this.state.value[component.id].toString()
        }
      }
      return (
        <FormField key={index} id={component.id} type={component.type} title={component.title} help={component.help}>
          {getFormComponent(this, component, null, this.state.value[component.id])}
        </FormField>
      )
    }.bind(this))

    const header = (
      <span>
        {headerText}
        <Button className="pull-right" bsStyle="danger" bsSize="xsmall" onClick={this.props.handleDelete}><i className='fa fa-trash'></i></Button>
      </span>
    )

    return (
      <ExpandablePanel header={header}>
        {componentNodes}
      </ExpandablePanel>
    )
  }

})
