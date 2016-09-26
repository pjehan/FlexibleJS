import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'

import { FormControl, Button, ButtonGroup } from 'react-bootstrap'

var Image = React.createClass({

  getInitialState: function() {
    return {id: null, value: []};
  },

  componentDidMount: function() {
    this.setState({id: this.props.template.id, value: (this.props.value) || []});
  },

  componentWillReceiveProps: function(newProps) {
    if (this.state.id != newProps.template.id) {
      this.setState({id: newProps.template.id, value: (newProps.value) || []});
    }
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
      var newImages = [];
      for (var i = 0; i < data.length; i++) {
        newImages.push({
          src: data[i],
          alt: null
        });
      }
      self.setState({value: images.concat(newImages)}, function() {
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
    self.setState({value: images}, function() {
      self.props.handleChange(self.state);
    });
  },

  handleAlt: function(image, e) {
    e.preventDefault();

    var self = this;
    var alt = image.alt;

    this.props.handleModal({
      title: 'Edit image alternate text',//this.props.intl.formatMessage({id: 'modal.page.delete.title'}),
      body: (
        <FormControl type="text" defaultValue={alt} onChange={this.handleAltChange.bind(this, image)} />
      ),
      buttons: [
        {
          style: 'success',
          icon: 'check',
          content: 'Save',
          onClick: function () {
            console.log(self.state);
            self.props.handleChange(self.state);
          }
        }
      ],
      close: function(callback) {
        var images = self.state.value.filter((obj) => {return obj.src != image.src});
        image.alt = alt;
        self.setState({value: images.concat(image)});
        callback();
      }
    });
  },

  handleAltChange: function(image, e) {
    var images = this.state.value.filter((obj) => {return obj.src != image.src});
    image.alt = e.target.value;
    this.setState({value: images.concat(image)});
  },

  render() {

    if (this.state.value && this.state.value.length > 0) {
      var imageNodes = this.state.value.map(function(image, index){
        return (
          <div key={index}>
            <div className="img-overlay">
              <ButtonGroup>
                <Button bsStyle="primary" onClick={this.handleAlt.bind(this, image)}><i className="fa fa-pencil"></i></Button>
                <Button bsStyle="danger" onClick={this.handleDelete.bind(this, image)}><i className="fa fa-trash"></i></Button>
              </ButtonGroup>
            </div>
            <img src={this.getImageUrl(image.src)} className="img-thumbnail img-responsive"/>
            <input type="hidden" name={this.props.template.id} value={image.src}></input>
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

module.exports = injectIntl(Image);
