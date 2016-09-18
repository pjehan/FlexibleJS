import React from 'react'
import { findDOMNode } from 'react-dom'
import clone from 'clone'

import { Col, FormGroup, InputGroup, FormControl, Panel, Button, ButtonGroup } from 'react-bootstrap'

import { DragSource, DropTarget } from 'react-dnd'
import flow from 'lodash.flow'

import { getFormComponent } from '../../js/utils.jsx'

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

    props.handleMoveCol(dragIndex, hoverIndex);

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

var BuilderCol = React.createClass({

  getInitialState: function() {
    return {id: null, value: null};
  },

  componentDidMount: function() {
    this.setState({id: this.props.component.id, value: this.props.component});
  },

  componentWillReceiveProps: function(newProps) {
    this.setState({id: newProps.component.id, value: newProps.component});
  },

  handleChange: function(data) {
    var col = clone(this.state.value);
    col.value = data.value;
    this.setState({value: col}, function() {
      this.props.handleChange(this.state);
    });
  },

  handleColDelete: function(event) {
    this.props.handleColDelete(this.state.value);
  },

  handleColResize: function(event) {
    var col = clone(this.state.value);

    col.size = parseInt(event.target.value);

    this.setState({value: col}, function() {
      this.props.handleChange(this.state);
    });
  },

  render() {
    var isDragging = this.props.isDragging;
    var connectDragSource = this.props.connectDragSource;
    var connectDropTarget = this.props.connectDropTarget;
    var style = {
      opacity: isDragging ? 0 : 1,
      cursor: 'move'
    };

    var col = this.state.value;

    if (col) {
      var template = {
        id: col.id,
        type: col.type
      }

      var header = (
        <div>
          <ButtonGroup>
            <Button bsStyle="danger" onClick={this.handleColDelete}><i className="fa fa-trash"></i></Button>
          </ButtonGroup>
          <FormGroup className="input-resizer">
            <InputGroup>
              <InputGroup.Addon><i className="fa fa-expand"></i></InputGroup.Addon>
              <FormControl
                type="number"
                name="size"
                min="0"
                max="12"
                value={col.size}
                onChange={this.handleColResize}
                />
            </InputGroup>
          </FormGroup>
        </div>
      )

      return connectDragSource(connectDropTarget(
        <div>
          <Col md={col.size}>
            <Panel header={header} className="panel-hover-header">
              {getFormComponent(this, template, col.value)}
            </Panel>
          </Col>
        </div>
      ));
    }

    return null;
  }

});

module.exports = flow(
  DragSource('BuilderCol', rowSource, collectSource),
  DropTarget('BuilderCol', rowTarget, collectTarget)
)(BuilderCol);
