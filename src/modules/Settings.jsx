import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'
import { browserHistory } from 'react-router'

import { Grid, Panel, Button, FormControl } from 'react-bootstrap'

var Settings = React.createClass({
  render() {

    const title = (
      <h3>{this.props.intl.formatMessage({id: 'page.settings.backup.title'})}</h3>
    );

    return (
      <Grid>
        <h1>{this.props.intl.formatMessage({id: 'page.settings.title'})}</h1>
        <Panel header={title}>
          <FormControl id="formImport" type="file" label="Import"/>
          <Button bsStyle="primary"><i className="fa fa-download"></i> Import</Button>
          <Button bsStyle="primary"><i className="fa fa-upload"></i> Export</Button>
        </Panel>
      </Grid>
    )
  }
});

module.exports = injectIntl(Settings);
