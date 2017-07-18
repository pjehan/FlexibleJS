import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { browserHistory } from 'react-router'

import { Grid, Panel, Button, ButtonToolbar, ControlLabel, FormControl } from 'react-bootstrap'

class Settings extends React.Component {

  exportDatabase(event) {
    $.get('/api/settings/export-database')
    .done(function(result){
      window.location.href = result.path;
    });
  }

  importDatabase(event) {
    var form = $(event.target).parents('form')[0];

    var data = new FormData(form);

    $.ajax({
      type: 'POST',
      url: '/api/settings/import-database/' + event.target.name,
      data: data,
      cache: false,
      contentType: false,
      processData: false,
    })
    .done(function(data) {
      console.log(data);
      this.props.handleNotification({
        title: this.props.intl.formatMessage({id: 'notification.importdb.success.title'}),
        message: this.props.intl.formatMessage({id: 'notification.importdb.success.message'})
      });
    })
    .fail(function(jqXHR, textStatus) {
      console.log(jqXHR);
      console.log(textStatus);
      this.props.handleNotification({
        title: this.props.intl.formatMessage({id: 'notification.importdb.error.title'}),
        message: this.props.intl.formatMessage({id: 'notification.importdb.error.message'})
      });
    });
  }

  exportFiles() {
    fetch('/api/settings/export-files')
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      window.location.href = data.path;
    })
    .catch((error) => {
      console.log(error);
    })
  }

  importFiles(event) {
    var form = $(event.target).parents('form')[0];
    var data = new FormData(form);

    fetch('/api/settings/import-files/' + event.target.name, {
      method: 'POST',
      body: data,
      cache: false,
      contentType: false,
      processData: false,
    })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      this.props.handleNotification({
        title: this.props.intl.formatMessage({id: 'notification.importfiles.success.title'}),
        message: this.props.intl.formatMessage({id: 'notification.importfiles.success.message'})
      });
    })
    .catch((error) => {
      console.log(error);
      this.props.handleNotification({
        title: this.props.intl.formatMessage({id: 'notification.importfiles.error.title'}),
        message: this.props.intl.formatMessage({id: 'notification.importfiles.error.message'})
      });
    })
  }

  render() {

    const title = (
      <h3>{this.props.intl.formatMessage({id: 'title.backup'})}</h3>
    );

    return (
      <Grid>
        <h1>{this.props.intl.formatMessage({id: 'title.settings'})}</h1>
        <Panel header={title}>

          <h4><FormattedMessage id="title.database"/></h4>
          <form encType="multipart/form-data">
            <ButtonToolbar>
              <ControlLabel className="btn btn-primary" htmlFor="formImportDb">
                <i className="fa fa-download"></i><FormControl id="formImportDb" type="file" name="formImportDb" className="hidden" onChange={this.importDatabase}/> <FormattedMessage id="btn.import"/>
              </ControlLabel>
              <Button bsStyle="primary" onClick={this.exportDatabase}><i className="fa fa-upload"></i> <FormattedMessage id="btn.export"/></Button>
            </ButtonToolbar>
          </form>

          <h4><FormattedMessage id="title.files"/></h4>
          <ButtonToolbar>
            <form encType="multipart/form-data">
              <ControlLabel className="btn btn-primary" htmlFor="formImportFiles">
                <i className="fa fa-download"></i><FormControl id="formImportFiles" type="file" name="formImportFiles" className="hidden" onChange={this.importFiles.bind(this)}/> <FormattedMessage id="btn.import"/>
              </ControlLabel>
            </form>
            <Button bsStyle="primary" onClick={this.exportFiles}><i className="fa fa-upload"></i> <FormattedMessage id="btn.export"/></Button>
          </ButtonToolbar>

        </Panel>
      </Grid>
    )
  }
}

module.exports = injectIntl(Settings)
