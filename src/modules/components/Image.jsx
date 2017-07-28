import React from 'react'
import { injectIntl, FormattedMessage } from 'react-intl'

import { FormControl, Button, ButtonGroup } from 'react-bootstrap'

var Image = React.createClass({

  getInitialState: function() {
    return {id: null, value: []};
  },

  componentDidMount: function() {
    this.setState({id: this.props.template.id, value: this.props.value || []}, () => {
      if (this.props.handleValidationState) {
        this.props.handleValidationState(this.getValidationState());
      }
    });
  },

  componentWillReceiveProps: function(newProps) {
    if (this.state.id != newProps.template.id || this.state.value != newProps.value) {
      this.setState({id: newProps.template.id, value: newProps.value || []});
    }
  },

  componentDidUpdate(prevProps, nextProps) {
    if (typeof prevProps.value != 'undefined' && prevProps.value != nextProps.value) {
      if (this.props.handleValidationState) {
        this.props.handleValidationState(this.getValidationState());
      }
    }
  },

  getValidationState: function() {
    if (this.props.template.required && this.state.value.length == 0) {
      return {state: 'error', message: this.props.intl.formatMessage({id: 'validation.required'})};
    }
    return {state: 'success'};
  },

  getImageUrl: function(img) {
    return img.endsWith('.svg') ? '/uploads/' + img : '/uploads/' + img + '?resize=110,110';
  },

  handleChange: function(e) {
    var self = this;

    const nbFiles = e.target.files.length;

    for (var i = 0; i < e.target.files.length; i++) {
      let file = e.target.files[i]
      let reader = new FileReader();

      reader.onloadend = () => {
        let formData = new FormData();
        formData.append(this.props.template.id, file)
        formData.append('flexibleImageHeight', this.props.template.height);
        formData.append('flexibleImageWidth', this.props.template.width);
        formData.append('flexibleImageMaxHeight', this.props.template.max_height);
        formData.append('flexibleImageMaxWidth', this.props.template.max_width);
        $.ajax({
          type: 'POST',
          url: '/api/files/upload',
          data: formData,
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
            // If only one image uploaded, show alt modal
            if (nbFiles == 1) {
              this.handleAlt(newImages[0]);
            }
          });
        })
        .fail(function(jqXHR, textStatus) {
          console.log(jqXHR);
          console.log(textStatus);
        });
      }

      reader.readAsDataURL(file);
    };
  },

  handleDelete: function(image, e) {
    e.preventDefault();

    var images = this.state.value.filter((obj) => {return obj != image});
    this.setState({value: images}, () => {
      this.props.handleChange(this.state);
    });
  },

  handleAlt: function(image, e) {
    if (e) {
      e.preventDefault();
    }

    var self = this;
    var alt = image.alt;

    this.props.handleModal({
      title: this.props.intl.formatMessage({id: 'title.editImageAlt'}),
      body: (
        <FormControl type="text" defaultValue={alt} onChange={this.handleAltChange.bind(this, image)} />
      ),
      buttons: [
        {
          style: 'success',
          icon: 'check',
          content: this.props.intl.formatMessage({id: 'btn.save'}),
          onClick: function () {
            self.props.handleChange(self.state);
          }
        }
      ],
      close: function(callback) {
        var i = self.state.value.findIndex((obj) => {return obj.src == image.src});
        var images = self.state.value;
        images[i].alt = alt;
        self.setState({value: images});
        callback();
      }
    });
  },

  handleAltChange: function(image, e) {
    var i = this.state.value.findIndex((obj) => {return obj.src == image.src});
    var images = this.state.value;
    images[i].alt = e.target.value;
    this.setState({value: images});
  },

  render() {

    var imageNodes = null;

    if (this.state.value && this.state.value.length > 0) {
      imageNodes = this.state.value.map(function(image, index){
        return (
          <div key={index}>
            <div className="img-overlay">
              <ButtonGroup>
                <Button bsStyle="primary" onClick={this.handleAlt.bind(this, image)}><i className="fa fa-pencil"></i></Button>
                <Button bsStyle="danger" onClick={this.handleDelete.bind(this, image)}><i className="fa fa-trash"></i></Button>
              </ButtonGroup>
            </div>
            <img src={this.getImageUrl(image.src)} className="img-thumbnail img-responsive"/>
          </div>
        );
      }.bind(this));
    }

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

  }

})

module.exports = injectIntl(Image);
