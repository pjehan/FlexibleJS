import React from 'react'

const K_WIDTH = 40
const K_HEIGHT = 40

const markerStyle = {
  // initially any map object has left top corner at lat lng coordinates
  // it's on you to set object origin to 0,0 coordinates
  position: 'absolute',
  width: K_WIDTH,
  height: K_HEIGHT,
  left: -K_WIDTH / 2,
  top: -K_HEIGHT,

  textAlign: 'center',
  fontSize: 36,
  padding: 4
}

module.exports = React.createClass({

  render() {
    return (
      <div className="fa fa-map-marker text-primary" style={markerStyle}>
        {this.props.text}
      </div>
    )
  }

})
