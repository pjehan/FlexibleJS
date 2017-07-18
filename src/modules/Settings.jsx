import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { browserHistory } from 'react-router'

import { Grid, Row, Col, Panel, Label, Button, ButtonToolbar, ControlLabel, FormControl, ListGroup, ListGroupItem } from 'react-bootstrap'

class Settings extends React.Component {

  constructor(props) {
    super(props);
    this.state = {files: []};
  }

  componentDidMount() {
    this.refreshFilesList();
  }

  refreshFilesList() {
    fetch('/api/settings/list-backup-files')
    .then(response => { return response.json() })
    .then(data => {
      this.setState({files: data.files});
    })
    .catch(error => console.log(error))
  }

  exportDatabase(event) {
    fetch('/api/settings/export-database')
    .then(response => { return response.json() })
    .then(data => {
      this.refreshFilesList();
      window.location.href = data.path;
    })
    .catch(error => console.log(error))
  }

  importDatabase(event) {
    var form = $(event.target).parents('form')[0];
    var data = new FormData(form);

    fetch('/api/settings/import-database/' + event.target.name, {
      method: 'POST',
      body: data,
      cache: false,
      contentType: false,
      processData: false,
    })
    .then(response => { return response.json() })
    .then((data) => {
      this.refreshFilesList();
      this.props.handleNotification({
        title: this.props.intl.formatMessage({id: 'notification.importdb.success.title'}),
        message: this.props.intl.formatMessage({id: 'notification.importdb.success.message'})
      });
    })
    .catch((error) => {
      console.log(error);
      this.props.handleNotification({
        title: this.props.intl.formatMessage({id: 'notification.importdb.error.title'}),
        message: this.props.intl.formatMessage({id: 'notification.importdb.error.message'})
      });
    })
  }

  exportFiles() {
    fetch('/api/settings/export-files')
    .then(response => { return response.json() })
    .then((data) => {
      this.refreshFilesList();
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
    .then(response => { return response.json() })
    .then((data) => {
      this.refreshFilesList();
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

  deleteFile(filename) {
    fetch('/api/settings/delete-file/' + filename, {method: 'DELETE'})
    .then(response => { return response.json() })
    .then(data => {
      this.refreshFilesList();
    })
    .catch(error => console.log(error))
  }

  render() {

    const title = (
      <h3>{this.props.intl.formatMessage({id: 'title.backup'})}</h3>
    );

    var fileNodes = this.state.files.map(file => {
      return (
        <ListGroupItem key={file.filename}>
          <Button bsStyle="primary" className="pull-right btn-sm" href={'/backup/' + file.filename}><i className='fa fa-download'></i></Button>
          <Button bsStyle="danger" className="pull-right btn-sm" onClick={this.deleteFile.bind(this, file.filename)}><i className='fa fa-trash'></i></Button>
          <h4 className="list-group-item-heading">{file.filename}</h4>
          <Label bsStyle="primary">{file.size}</Label>&nbsp;
          <Label bsStyle="primary">{file.createdAt}</Label>
        </ListGroupItem>
      )
    })

    return (
      <Grid>
        <h1>{this.props.intl.formatMessage({id: 'title.settings'})}</h1>
        <Panel header={title}>

          <Row>

            <Col md={3}>
              <h4><FormattedMessage id="title.database"/></h4>
              <form encType="multipart/form-data">
                <ButtonToolbar>
                  <ControlLabel className="btn btn-primary" htmlFor="formImportDb">
                    <i className="fa fa-download"></i><FormControl id="formImportDb" type="file" name="formImportDb" className="hidden" onChange={this.importDatabase.bind(this)}/> <FormattedMessage id="btn.import"/>
                  </ControlLabel>
                  <Button bsStyle="primary" onClick={this.exportDatabase.bind(this)}><i className="fa fa-upload"></i> <FormattedMessage id="btn.export"/></Button>
                </ButtonToolbar>
              </form>

              <h4><FormattedMessage id="title.files"/></h4>
              <ButtonToolbar>
                <form encType="multipart/form-data">
                  <ControlLabel className="btn btn-primary" htmlFor="formImportFiles">
                    <i className="fa fa-download"></i><FormControl id="formImportFiles" type="file" name="formImportFiles" className="hidden" onChange={this.importFiles.bind(this)}/> <FormattedMessage id="btn.import"/>
                  </ControlLabel>
                </form>
                <Button bsStyle="primary" onClick={this.exportFiles.bind(this)}><i className="fa fa-upload"></i> <FormattedMessage id="btn.export"/></Button>
              </ButtonToolbar>
            </Col>

            <Col md={9}>
              <ListGroup className="settings-files">
                {fileNodes}
              </ListGroup>
            </Col>

          </Row>

        </Panel>
      </Grid>
    )
  }
}

module.exports = injectIntl(Settings)
