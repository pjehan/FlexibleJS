import React from 'react'
import { findDOMNode } from 'react-dom'
import randomstring from 'randomstring'
import clone from 'clone'
require('array.prototype.move')

import { Row, Panel, Button, DropdownButton, ButtonGroup, MenuItem } from 'react-bootstrap'

import { DragSource, DropTarget } from 'react-dnd'
import flow from 'lodash.flow'

import BuilderCol from './BuilderCol.jsx'

var rowSource = {
  beginDrag: function (props) {
    return {
      index: props.index
    };
  }
}

var rowTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    if (dragIndex === hoverIndex) {
      return;
    }

    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    const clientOffset = monitor.getClientOffset();
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    props.handleMoveRow(dragIndex, hoverIndex);

    monitor.getItem().index = hoverIndex;
  }
}

function collectSource(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    connectDragPreview: connect.dragPreview(),
    isDragging: monitor.isDragging()
  };
}

function collectTarget(connect) {
  return {
    connectDropTarget: connect.dropTarget()
  };
}

var BuilderRow = React.createClass({

  getInitialState: function() {
    return {id: null, value: null};
  },

  componentDidMount: function() {
    this.setState({id: this.props.row.id, value: this.props.row});
  },

  componentWillReceiveProps: function(newProps) {
    this.setState({id: newProps.row.id, value: newProps.row});
  },

  handleChange: function(data) {
    var row = clone(this.state.value);

    for (var i = 0; i < row.components.length; i++) {
      if (row.components[i].id == data.id) {
        row.components[i] = data.value;
      }
    }

    this.setState({value: row}, function() {
      this.props.handleChange(this.state);
    });
  },

  handleRowDelete: function(row, event) {
    this.props.handleRowDelete(row);
  },

  handleColNew: function(type, event) {
    var row = clone(this.state.value);

    var component = component = {
      id: randomstring.generate({length: 12, charset: 'alphabetic'}).toLowerCase(),
      type: type,
      size: 12
    };
    row.components.push(component);

    this.setState({value: row}, function() {
      this.props.handleChange(this.state);
    });
  },

  handleColDelete: function(component, event) {
    var row = clone(this.state.value);

    for (var i = 0; i < row.components.length; i++) {
      if (row.components[i].id == component.id) {
        row.components.splice(i, 1);
      }
    }

    this.setState({value: row}, function() {
      this.props.handleChange(this.state);
    });
  },

  handleMoveCol: function(dragIndex, hoverIndex) {
    var row = this.state.value;

    row.components.move(dragIndex, hoverIndex);

    this.setState({value: row});
  },

  render() {
    var isDragging = this.props.isDragging;
    var connectDragSource = this.props.connectDragSource;
    var connectDropTarget = this.props.connectDropTarget;
    var style = {
      opacity: isDragging ? 0 : 1,
      cursor: 'move'
    };

    var componentNodes = [];

    if (this.state.value) {
      componentNodes = this.state.value.components.map(function(component, index){
        return (
          <BuilderCol component={component} index={index} handleChange={this.handleChange} handleColDelete={this.handleColDelete.bind(this, component)} handleMoveCol={this.handleMoveCol} key={component.id}></BuilderCol>
        )
      }.bind(this));
    }

    var btnNew = <span><i className="fa fa-plus"></i>&nbsp;</span>

    var header = (
      <div>
        <ButtonGroup>
          <DropdownButton bsStyle="primary" title={btnNew} id={"dropdown-" + this.state.id}>
            <MenuItem onClick={this.handleColNew.bind(this, 'text')}>Text</MenuItem>
            <MenuItem onClick={this.handleColNew.bind(this, 'wysiwyg')}>Wysiwyg</MenuItem>
            <MenuItem onClick={this.handleColNew.bind(this, 'image')}>Image</MenuItem>
          </DropdownButton>
          <Button bsStyle="danger" onClick={this.handleRowDelete.bind(this, this.state.value)}><i className="fa fa-trash"></i></Button>
        </ButtonGroup>
      </div>
    );

    return connectDragSource(connectDropTarget(
      <div>
        <Panel header={header} className="panel-hover-header" style={ style }>
          <Row>
            {componentNodes}
          </Row>
        </Panel>
      </div>
    ));

  }

});

module.exports = flow(
  DragSource('BuilderRow', rowSource, collectSource),
  DropTarget('BuilderRow', rowTarget, collectTarget)
)(BuilderRow);
