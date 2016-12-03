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

  render() {

    const title = (
      <h3>{this.props.intl.formatMessage({id: 'title.backup'})}</h3>
    );

    return (
      <Grid>
        <h1>{this.props.intl.formatMessage({id: 'title.settings'})}</h1>
        <Panel header={title}>

          <h4><FormattedMessage id="title.database"/></h4>
          <ButtonToolbar>
            <ControlLabel className="btn btn-primary" htmlFor="formImportDb">
              <i className="fa fa-download"></i><FormControl id="formImportDb" type="file" className="hidden"/> <FormattedMessage id="btn.import"/>
            </ControlLabel>
            <Button bsStyle="primary" onClick={this.exportDatabase}><i className="fa fa-upload"></i> <FormattedMessage id="btn.export"/></Button>
          </ButtonToolbar>

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
