import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { browserHistory } from 'react-router'

import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table'

import { ButtonGroup, Button, Modal, FormGroup, FormControl, ControlLabel, HelpBlock } from 'react-bootstrap'

import moment from 'moment'

var ListPage = React.createClass({

  getInitialState: function() {
    return {pages: [], page: null, selectedPages: []}
  },

  componentDidMount: function() {
    var self = this
    $.get('/api/pages/' + this.props.componentId + '/' + this.props.template.id + '/children', function(result) {
      self.setState({pages: result})
    })
    this.setState({page: {template: this.props.template.template, parent: this.props.componentId}})
  },

  componentWillReceiveProps: function(newProps) {
    if (this.state.page && newProps.template.template !== this.state.page.template) {
      var self = this
      $.get('/api/pages/' + newProps.componentId + '/' + newProps.template.id + '/children', function(result) {
        self.setState({pages: result})
      })
      this.setState({page: {template: newProps.template.template, parent: newProps.componentId}})
    }
  },

  handleChange: function(event) {
    this.props.handleChange({
      id: event.target.id,
      value: event.target.value
    })
  },

  closeNewPageModal() {
    this.setState({ showNewPageModal: false })
  },

  openNewPageModal() {
    this.setState({ showNewPageModal: true })
  },

  handleNewPageChange: function(e) {
    var page = this.state.page
    page[e.target.name] = e.target.value
    this.setState({page: page})
  },

  submitNewPage: function(e) {
    e.preventDefault()
    var self = this

    var data = this.state.page
    console.log(this.props)
    data.site_id = this.props.site.id
    data.component_id = this.props.template.id

    $.ajax({
      type: 'POST',
      url: '/api/pages/',
      data: data
    })
      .done(function(data) {
        self.closeNewPageModal()
        var pages = self.state.pages
        pages.unshift(data)
        self.setState({pages: pages})
      })
      .fail(function(jqXhr) {
        console.log('failed to create new page')
      })
  },

  handleEditPage: function(e) {
    browserHistory.push('/pages/' + this.state.selectedPages[0]._id)
  },

  handleDeletePage: function(e) {
    var self = this

    for (var i = 0; i < this.state.selectedPages.length; i++) {
      var page = this.state.selectedPages[i]
      $.ajax({
        type: 'DELETE',
        url: '/api/pages/' + page._id
      })
        .done(function(data) {
          var pages = self.state.pages.filter(function(obj) {
            return obj._id !== page._id
          })
          self.setState({pages: pages, selectedPages: []})
        })
        .fail(function(jqXhr) {
          console.log('failed to delete page')
        })
    }
  },

  dateFormatter(cell, row) {
    return moment(cell).format('YYYY/MM/DD hh:mm:ss')
  },

  onRowSelect(row, isSelected) {
    var selectedPages = this.state.selectedPages

    if (isSelected) {
      selectedPages = [] // Remove this line for checkbox selection
      selectedPages.push(row)
    } else {
      selectedPages = selectedPages.filter(function(obj) {
        return obj._id !== row._id
      })
    }

    this.setState({selectedPages: selectedPages})
  },

  onSelectAll(isSelected) {
    if (isSelected) {
      this.setState({selectedPages: this.state.pages})
    } else {
      this.setState({selectedPages: []})
    }
  },

  render() {
    var selectRowProp = {
      mode: 'radio',
      clickToSelect: true,
      onSelect: this.onRowSelect,
      onSelectAll: this.onSelectAll
    }

    return (
      <div>
        <ButtonGroup className='component-btn-group'>
          <Button bsStyle="primary" onClick={this.openNewPageModal}><i className="fa fa-plus"></i> <FormattedMessage id="btn.add"/></Button>
          <Button bsStyle="warning" onClick={this.handleEditPage} disabled={this.state.selectedPages.length <= 0}><i className="fa fa-edit"></i> <FormattedMessage id="btn.edit"/></Button>
          <Button bsStyle="danger" onClick={this.handleDeletePage} disabled={this.state.selectedPages.length <= 0}><i className="fa fa-trash"></i> <FormattedMessage id="btn.delete"/></Button>
        </ButtonGroup>
        <BootstrapTable data={this.state.pages} pagination={true} selectRow={selectRowProp}>
          <TableHeaderColumn dataField="_id" isKey={true} hidden={true}>ID</TableHeaderColumn>
          <TableHeaderColumn dataField="title" dataSort={true}><FormattedMessage id="form.title"/></TableHeaderColumn>
          <TableHeaderColumn dataField="created_date" dataFormat={this.dateFormatter} dataSort={true}><FormattedMessage id="form.createdDate"/></TableHeaderColumn>
          <TableHeaderColumn dataField="updated_date" dataFormat={this.dateFormatter} dataSort={true}><FormattedMessage id="form.modifiedDate"/></TableHeaderColumn>
        </BootstrapTable>

        <Modal show={this.state.showNewPageModal} onHide={this.closeNewPageModal}>
          <form action={'/api/pages'} method="POST" onSubmit={this.submitNewPage}>
            <Modal.Header closeButton>
              <Modal.Title><FormattedMessage id="btn.newpage"/></Modal.Title>
            </Modal.Header>
            <Modal.Body>

              <FormGroup controlId="title">
                <ControlLabel><FormattedMessage id="form.title"/></ControlLabel>
                <FormControl
                  type="text"
                  name="title"
                  placeholder={this.props.intl.formatMessage({id: 'form.title'})}
                  required={true}
                  onChange={this.handleNewPageChange}
                />
                <FormControl.Feedback />
                <HelpBlock></HelpBlock>
              </FormGroup>

            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.closeNewPageModal}><i className="fa fa-times"></i> <FormattedMessage id="btn.close"/></Button>
              <Button type="submit" bsStyle="success"><i className="fa fa-check"></i> <FormattedMessage id="btn.create"/></Button>
            </Modal.Footer>
          </form>
        </Modal>

      </div>
    )
  }

})

module.exports = injectIntl(ListPage)
