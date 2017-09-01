import { Alert } from 'react-bootstrap'

import Input from '../modules/components/Input.jsx'
import Image from '../modules/components/Image.jsx'
import Icon from '../modules/components/Icon.jsx'
import Dropdown from '../modules/components/Dropdown.jsx'
import Textarea from '../modules/components/Textarea.jsx'
import Wysiwyg from '../modules/components/Wysiwyg.jsx'
import Map from '../modules/components/Map.jsx'

module.exports = {

  getFormComponent: function(self, template, component, value, visible) {
    switch (template.type) {
      case 'text':
      case 'email':
      case 'date':
      case 'datetime':
      case 'datetime-local':
      case 'time':
      case 'number':
      case 'password':
      case 'tel':
      case 'url':
      case 'color':
        return (
          <Input
            template={template}
            value={value}
            site={self.props.site}
            component={self.props.component}
            handleChange={self.props.handleChange}
            handleNotification={self.props.handleNotification}
            handleModal={self.props.handleModal}
            handleValidationState={self.handleValidationState}>
          </Input>
        )
      case 'dropdown':
        return (
          <Dropdown
            template={template}
            site={self.props.site}
            language={self.props.language}
            value={value}
            handleChange={self.props.handleChange}
            handleNotification={self.props.handleNotification}
            handleModal={self.props.handleModal}
            handleValidationState={self.handleValidationState}>
          </Dropdown>
        )
      case 'image':
        return (
          <Image
            template={template}
            value={value}
            handleChange={self.props.handleChange}
            handleNotification={self.props.handleNotification}
            handleModal={self.props.handleModal}
            handleValidationState={self.handleValidationState}>
          </Image>
        )
      case 'icon':
        return (
          <Icon template={template} value={value} handleChange={self.props.handleChange} handleNotification={self.props.handleNotification} handleModal={self.props.handleModal}></Icon>
        )
      case 'textarea':
        return (
          <Textarea template={template} value={value} handleChange={self.props.handleChange} handleNotification={self.props.handleNotification} handleModal={self.props.handleModal}></Textarea>
        )
      case 'wysiwyg':
        return (
          <Wysiwyg template={template} value={value} handleChange={self.props.handleChange} handleNotification={self.props.handleNotification} handleModal={self.props.handleModal}></Wysiwyg>
        )
      case 'map':
        return (
          <Map template={template} value={value} visible={visible} handleChange={self.props.handleChange} handleNotification={self.props.handleNotification} handleModal={self.props.handleModal}></Map>
        )
      default:
        return (
          <Alert bsStyle="danger">
            <strong>{template.type}</strong> component not yet implemented!
          </Alert>
        )
    }
  }

}
