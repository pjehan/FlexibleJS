import React from 'react'

import { fitBounds } from 'google-map-react/utils';
import GoogleMap from 'google-map-react';
import MapMarker from './MapMarker.jsx';

const containerStyle = {
  height: '300px',
  position: 'relative'
};

module.exports =  React.createClass({

  getInitialState: function() {
    return {id: null, value: [], center: null, zoom: null};
  },

  componentDidMount: function() {
    this.setState({
      id: this.props.template.id,
      value: (this.props.value) ? this.props.value : [],
      center: this.props.template.center,
      zoom: this.props.template.zoom
    });
  },

  componentWillReceiveProps: function(newProps) {
    this.setState({
      id: newProps.template.id,
      value: (newProps.value) ? newProps.value : [],
      center: newProps.template.center,
      zoom: newProps.template.zoom
    });
  },

  handleChange: function(event) {
    this.setState({value: [{lat: event.lat, lng: event.lng}]}, function() {
      this.props.handleChange(this.state);
    });
  },

  render() {

    var markerNodes = this.state.value.map(function(marker, index){
      return (
        <MapMarker key={index} lat={marker.lat} lng={marker.lng} draggable={true}></MapMarker>
      );
    }.bind(this));

    var mapOptions = {
      mapTypeControl: true
    };

    // If the map is not visible to the user, do not display it (fix when inside Bootstrap collapse)
    if (!this.props.visible) {
      return null;
    }

    return (
      <div id={this.props.template.id} style={containerStyle}>
        <GoogleMap
          bootstrapURLKeys={{
            key: this.props.template.api_key
          }}
          center={this.state.center}
          zoom={this.state.zoom}
          options={mapOptions}
          onClick={this.handleChange}>
          {markerNodes}
        </GoogleMap>
      </div>
    );

  }

})
