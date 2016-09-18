import React from 'react'

import { FormControl, Button } from 'react-bootstrap'
//var $ = window.jQuery = require('jquery')

module.exports =  React.createClass({

  getInitialState: function() {
    return {id: null, value: []};
  },

  componentDidMount: function() {
    this.setState({id: this.props.template.id, value: (this.props.value) || []});
  },

  componentWillReceiveProps: function(newProps) {
    this.setState({id: newProps.template.id, value: (newProps.value) || []});
  },

  getImageUrl: function(img) {
    return '/uploads/' + img + '?resize=110,110';
  },

  handleChange: function(e) {
    var self = this;
    var form = $(e.target).parents('form')[0];

    var data = new FormData(form);

    $.ajax({
      type: 'POST',
      url: '/api/files/upload/' + e.target.name,
      data: data,
      cache: false,
      contentType: false,
      processData: false,
    })
    .done(function(data) {
      var images = (self.props.template.multiple) ? self.state.value : [];
      self.setState({value: images.concat(data)}, function() {
        this.props.handleChange(this.state);
      });
    })
    .fail(function(jqXHR, textStatus) {
      console.log(jqXHR);
      console.log(textStatus);
    });
  },

  handleDelete: function(image, e) {
    e.preventDefault();

    var self = this;

    var images = this.state.value.filter((obj) => {return obj != image});

    this.props.handleModal({
      title: 'Delete this page?',
      body: 'Are you sur you want to delete this page? This action is not reversible.',
      icon: 'minus-circle text-danger',
      buttons: [
        {
          style: 'danger',
          icon: 'trash',
          content: 'Delete',
          onClick: function () {
            console.log(images);
            self.setState({value: images}, function() {
              console.log(self.state);
              self.props.handleChange(self.state);
            });
          }
        }
      ]
    });
  },

  render() {

    if (this.state.value && this.state.value.length > 0) {
      var imageNodes = this.state.value.map(function(image, index){
        return (
          <div key={index}>
            <img src={this.getImageUrl(image)} className="img-thumbnail img-responsive"/>
            <input type="hidden" name={this.props.template.id} value={image}></input>
            <Button bsStyle="danger" block onClick={this.handleDelete.bind(this, image)}><i className="fa fa-trash"></i> Delete</Button>
          </div>
        );
      }.bind(this));

      return (
        <div className="row">
          <div className="col-md-12">
            <FormControl
              type="file"
              name={this.props.template.id}
              multiple={this.props.template.multiple}
              onChange={this.handleChange}
              />
          </div>
          <div className="col-md-12">
            <div className="img-container">
              {imageNodes}
            </div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <FormControl
            type="file"
            name={this.props.template.id}
            multiple={this.props.template.multiple}
            onChange={this.handleChange}
            />
          <input type="hidden" name={this.props.template.id}></input>
        </div>
      )
    }

  }

})
