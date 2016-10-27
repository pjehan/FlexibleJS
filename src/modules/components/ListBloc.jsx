import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'

import Bloc from './Bloc.jsx'
import FormField from './FormField.jsx'
import { getFormComponent } from '../../js/utils.jsx'

import { Button, ButtonGroup } from 'react-bootstrap'

var ListBloc = React.createClass({

  getInitialState: function() {
    return {value: [], template: null};
  },

  componentDidMount: function() {
    var self = this;
    $.get('/api/templates/' + this.props.site.id + '/' + this.props.template.template, function(result){
      var componentValue = self.props.component[self.props.template.id] || [];
      self.setState({value: componentValue, template: result});
    });
  },

  componentWillReceiveProps: function(newProps) {
    if (newProps.component) {
      var componentValue = newProps.component[newProps.template.id] || [];
      this.setState({value: componentValue});
    }
  },

  changeValue: function(newValue){
    this.setState({value: newValue}, function() {
      this.props.handleChange({
        id: this.props.template.id,
        value: newValue
      });
    }.bind(this));
  },

  handleChange: function(index, data) {
    var value = this.state.value;
    value[index][data.id] = data.value;
    this.changeValue(value);
  },

  handleNew: function() {
    this.setState({ blocs: this.state.value.push({}) });
  },

  handleDelete: function(index, data) {
    var value = this.state.value;

    this.props.handleModal({
      title: this.props.intl.formatMessage({id: 'modal.bloc.delete.title'}),
      body: this.props.intl.formatMessage({id: 'modal.bloc.delete.message'}),
      icon: 'minus-circle text-danger',
      buttons: [
        {
          style: 'danger',
          icon: 'trash',
          content: 'Delete',
          onClick: function () {
            delete value[index];
            this.changeValue(value);
          }.bind(this)
        }
      ]
    });
  },

  render() {

    const buttons = (
      <ButtonGroup className='component-btn-group'>
        <Button bsStyle="primary" onClick={this.handleNew}><i className='fa fa-plus'></i> Add</Button>
      </ButtonGroup>
    );

    const blocNodes = this.state.value.map(function(bloc, blocIndex){
      return (
        <Bloc
          key={blocIndex}
          value={bloc}
          template={this.state.template}
          components={this.state.template.components}
          handleChange={this.handleChange.bind(this, blocIndex)}
          handleDelete={this.handleDelete.bind(this, blocIndex)}
          handleNotification={this.props.handleNotification}
          handleModal={this.props.handleModal}></Bloc>
      );
    }.bind(this));

    return (

      <div>
        {buttons}
        {blocNodes}
      </div>
    );

  }

});


module.exports = injectIntl(ListBloc);
