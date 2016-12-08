import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { browserHistory } from 'react-router'

import { Grid, Panel, Button, ButtonToolbar, ControlLabel, FormControl } from 'react-bootstrap'

var Settings = React.createClass({

  exportDatabase: function(event) {
    $.get('/api/settings/export-database')
    .done(function(result){
      window.location.href = result.path;
    });
  },

  importDatabase: function(event) {
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
    })
    .fail(function(jqXHR, textStatus) {
      console.log(jqXHR);
      console.log(textStatus);
    });
  },

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
            <ControlLabel className="btn btn-primary" htmlFor="formImportFiles">
              <i className="fa fa-download"></i><FormControl id="formImportFiles" type="file" className="hidden"/> <FormattedMessage id="btn.import"/>
            </ControlLabel>
            <Button bsStyle="primary"><i className="fa fa-upload"></i> <FormattedMessage id="btn.export"/></Button>
          </ButtonToolbar>

        </Panel>
      </Grid>
    )
  }
});

module.exports = injectIntl(Settings);
