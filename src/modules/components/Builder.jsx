import React from 'react'
import randomstring from 'randomstring'
import _ from 'lodash'
import clone from 'clone'

import { Panel, Button } from 'react-bootstrap'

import BuilderRow from './BuilderRow.jsx'

require('array.prototype.move')

module.exports = React.createClass({

  getInitialState: function() {
    return {id: null, value: []}
  },

  componentDidMount: function() {
    this.setState({id: this.props.template.id, value: (this.props.value) || []})
    // Display panel heading on mouseover
    $('main').on('mouseenter', '.panel-hover-header', function() {
      $('.panel-hover-header > .panel-heading').hide()
      $(this).children('.panel-hover-header > .panel-heading').show()
    })
    $('main').on('mouseleave', '.panel-hover-header', function() {
      $(this).children('.panel-hover-header > .panel-heading').hide()
      $(this).parent().closest('.panel-hover-header').children('.panel-heading:first').show()
    })
  },

  componentWillReceiveProps: function(newProps) {
    this.setState({id: newProps.template.id, value: (newProps.value) || []})
  },

  componentWillUpdate: function(newProps, newState) {
    // TODO: Fix a bug when re-ordering. The Lodash isEqual function doesn't consider properties order
    if (this.state.value.length > 0 && !_.isEqual(this.state.value, newState.value)) {
      this.props.handleChange({
        id: newState.id,
        value: newState.value
      })
    }
  },

  handleChange: function(data) {
    var rows = clone(this.state.value)

    for (var i = 0; i < rows.length; i++) {
      if (rows[i].id === data.id) {
        rows[i] = data.value
      }
    }

    this.setState({value: rows})
  },

  handleRowNew: function(event) {
    var rows = clone(this.state.value)
    var row = {
      id: randomstring.generate({length: 12, charset: 'alphabetic'}).toLowerCase(),
      components: []
    }
    rows.push(row)

    this.setState({value: rows})
  },

  handleRowDelete: function(row, event) {
    var rows = clone(this.state.value)

    for (var i = 0; i < rows.length; i++) {
      if (rows[i].id === row.id) {
        rows.splice(i, 1)
      }
    }

    this.setState({value: rows})
  },

  handleMoveRow: function(dragIndex, hoverIndex) {
    var rows = this.state.value

    rows.move(dragIndex, hoverIndex)

    this.setState({value: rows})
  },

  render() {
    var rowNodes = this.state.value.map(function(row, index) {
      return (
        <BuilderRow
          key={row.id}
          row={row}
          index={index}
          handleChange={this.handleChange}
          handleNotification={this.props.handleNotification}
          handleModal={this.props.handleModal}
          handleRowDelete={this.handleRowDelete.bind(this, row)}
          handleMoveRow={this.handleMoveRow}>
        </BuilderRow>
      )
    }.bind(this))

    var header = (
      <div>
        <Button bsStyle="primary" onClick={this.handleRowNew}><i className="fa fa-plus"></i></Button>
      </div>
    )

    return (
      <Panel header={header} className="panel-hover-header">
        {rowNodes}
      </Panel>
    )
  }

})
