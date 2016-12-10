import React from 'react'
import { Grid, Row, Col, FormControl, Form, FormGroup, ControlLabel } from 'react-bootstrap'
import moment from 'moment'

(function(w,d,s,g,js,fjs){
  g=w.gapi||(w.gapi={});g.analytics={q:[],ready:function(cb){this.q.push(cb)}};
  js=d.createElement(s);fjs=d.getElementsByTagName(s)[0];
  js.src='https://apis.google.com/js/platform.js';
  fjs.parentNode.insertBefore(js,fjs);js.onload=function(){g.load('analytics')};
}(window,document,'script'));

var timeline = null;
var devices = null;
var map = null;

module.exports =  React.createClass({
  
  getInitialState: function() {
    return {
      date_start: moment().subtract(30, 'days').format('YYYY-MM-DD'),
      date_end: moment().format('YYYY-MM-DD')
    };
  },
  
  componentDidMount: function() {
    var self = this;
    
    gapi.analytics.ready(function() {
      
      $.get('/api/dashboard/gapi-key')
      .done(function(result){
        
        var options = {
          query: {
            ids: 'ga:' + result.view_id
          }
        }
        
        gapi.analytics.auth.authorize({
          'serverAuth': {
            'access_token': result.token.access_token
          }
        });
        
        var mapChartClickListener;
        
        timeline = new gapi.analytics.googleCharts.DataChart({
          reportType: 'ga',
          query: {
            'dimensions': 'ga:date',
            'metrics': 'ga:sessions',
            'start-date': self.state.date_start,
            'end-date': self.state.date_end
          },
          chart: {
            type: 'LINE',
            container: 'timeline'
          }
        });
        timeline.set(options).execute();
        
        devices = new gapi.analytics.googleCharts.DataChart({
          reportType: 'ga',
          query: {
            'dimensions': 'ga:deviceCategory',
            'metrics': 'ga:sessions',
            'start-date': self.state.date_start,
            'end-date': self.state.date_end
          },
          chart: {
            type: 'PIE',
            container: 'devices'
          }
        });
        devices.set(options).execute();
        
        map = new gapi.analytics.googleCharts.DataChart({
          reportType: 'ga',
          query: {
            'dimensions': 'ga:country',
            'metrics': 'ga:sessions',
            'start-date': self.state.date_start,
            'end-date': self.state.date_end
          },
          chart: {
            type: 'GEO',
            container: 'map'
          }
        });
        
        map.on('success', function(response) {
          
          var chart = response.chart;
          var dataTable = response.dataTable;
          
          mapChartClickListener = google.visualization.events.addListener(chart, 'regionClick', function(event) {
            var region = event.region;
            var options = {
              query: {
                dimensions: 'ga:region',
                filters: 'ga:country==France'
              },
              chart: {
                options: {
                  region: region
                }
              }
            };
            
            map.set(options).execute();
          });
          
        });
        map.set(options).execute();        
        
      });
      
    });
  },
  
  refreshCharts: function() {
    const options = {
      query: {
        'start-date': this.state.date_start,
        'end-date': this.state.date_end
      }
    }
    timeline.set(options).execute();
    devices.set(options).execute();
    map.set(options).execute();
  },
  
  handleDateChange: function(event) {
    if (event.target.id == 'dateStart') {
      this.setState({date_start: event.target.value}, this.refreshCharts)
    } else {
      this.setState({date_end: event.target.value}, this.refreshCharts)
    }
  },
  
  render() {
    
    return (
      <Grid>
        <h1>Dashboard</h1>
        <Form inline>
          <FormGroup controlId="dateStart">
            <ControlLabel>Date Start</ControlLabel>
            <FormControl type='date' defaultValue={this.state.date_start} onChange={this.handleDateChange}/>
          </FormGroup>
          <FormGroup controlId="dateEnd">
            <ControlLabel>Date End</ControlLabel>
            <FormControl type='date' defaultValue={this.state.date_end} onChange={this.handleDateChange}/>
          </FormGroup>
        </Form>
        <Row>
          <Col md={6}><section id="timeline"></section></Col>
          <Col md={6}><section id="devices"></section></Col>
          <Col md={6}><section id="map"></section></Col>
        </Row>
      </Grid>
    )
  }
})
