import React from 'react'

import { FormControl } from 'react-bootstrap'

import Input from '../modules/components/Input.jsx'
import Image from '../modules/components/Image.jsx'
import Textarea from '../modules/components/Textarea.jsx'
import Wysiwyg from '../modules/components/Wysiwyg.jsx'
import List from '../modules/components/List.jsx'

module.exports = {

  getFormComponent: function (self, template, value) {
    switch (template.type) {
      case "text":
      case "email":
      case "date":
      case "datetime":
      case "datetime-local":
      case "time":
      case "number":
      case "password":
      case "tel":
      case "url":
      case "color":
      return (
        <div>
          <Input template={template} value={value} handleChange={self.handleChange} handleNotification={self.props.handleNotification} handleModal={self.props.handleModal}></Input>
          <FormControl.Feedback />
        </div>
      )
      break;
      case "image":
      return (
        <Image template={template} value={value} handleChange={self.handleChange} handleNotification={self.props.handleNotification} handleModal={self.props.handleModal}></Image>
      )
      break;
      case "textarea":
      return (
        <Textarea template={template} value={value} handleChange={self.handleChange} handleNotification={self.props.handleNotification} handleModal={self.props.handleModal}></Textarea>
      )
      break;
      case "wysiwyg":
      return (
        <Wysiwyg template={template} value={value} handleChange={self.handleChange} handleNotification={self.props.handleNotification} handleModal={self.props.handleModal}></Wysiwyg>
      )
      break;
      default:
      return (
        <Alert bsStyle="danger">
          <strong>{template.type}</strong> component not yet implemented!
        </Alert>
      )
    }
  }

}
