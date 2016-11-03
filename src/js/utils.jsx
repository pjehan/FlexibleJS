import React from 'react'

import { FormControl, Alert } from 'react-bootstrap'

import Input from '../modules/components/Input.jsx'
import Image from '../modules/components/Image.jsx'
import Icon from '../modules/components/Icon.jsx'
import Dropdown from '../modules/components/Dropdown.jsx'
import Textarea from '../modules/components/Textarea.jsx'
import Wysiwyg from '../modules/components/Wysiwyg.jsx'
import Map from '../modules/components/Map.jsx'

module.exports = {

  getFormComponent: function (self, template, value, visible) {
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
        <Input
          template={template}
          value={value}
          handleChange={self.props.handleChange}
          handleNotification={self.props.handleNotification}
          handleModal={self.props.handleModal}
          handleValidationState={self.handleValidationState}>
        </Input>
      )
      break;
      case "dropdown":
      return (
        <Dropdown template={template} site={self.props.site} language={self.props.language} value={value} handleChange={self.props.handleChange} handleNotification={self.props.handleNotification} handleModal={self.props.handleModal}></Dropdown>
      )
      break;
      case "image":
      return (
        <Image template={template} value={value} handleChange={self.props.handleChange} handleNotification={self.props.handleNotification} handleModal={self.props.handleModal}></Image>
      )
      break;
      case "icon":
      return (
        <Icon template={template} value={value} handleChange={self.props.handleChange} handleNotification={self.props.handleNotification} handleModal={self.props.handleModal}></Icon>
      )
      break;
      case "textarea":
      return (
        <Textarea template={template} value={value} handleChange={self.props.handleChange} handleNotification={self.props.handleNotification} handleModal={self.props.handleModal}></Textarea>
      )
      break;
      case "wysiwyg":
      return (
        <Wysiwyg template={template} value={value} handleChange={self.props.handleChange} handleNotification={self.props.handleNotification} handleModal={self.props.handleModal}></Wysiwyg>
      )
      break;
      case "map":
      return (
        <Map template={template} value={value} visible={visible} handleChange={self.props.handleChange} handleNotification={self.props.handleNotification} handleModal={self.props.handleModal}></Map>
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
