# FlexibleJS
FlexibleJS is based on NodeJS, ExpressJS, ReactJS and Mongodb. It makes creating a website backend really easy (with only two JSON config file).

## Installation
1. Clone the repository
2. Run the following command
```bash
npm install
```
3. Start gulp
```bash
gulp
```
4. Open the following URL in the browser: http://localhost:3000

## Usage
To create new pages in the admin interface, all you have to do is to edit one simple JSON file.  
To start, create a copy of the data.json.dist file. You can have a look at this file to see some examples of the pages/components you can create.

### Website
The JSON file contains an array of websites. Each website is described with the following object:
```json
{
  "id": "siteIdentifier",
  "title": "Site Name",
  "lang": ["fr", "en"],
  "templates": []
}
```

### Page Template
Inside a website, you can add page templates. Each template is described with the following object:
```json
{
  "id": "pageIdentifier",
  "title": "Page Name",
  "seo": true,
  "toString": "Component id",
  "components": [],
  "sections": []
}
```
And then inside a page template, you can define a list of components or a list of sections with components inside.  
The `toString` property is used to identify a template in a dropdown or in a list. Type one of the components id to display it's value.

### Sections
A section display a form collapsible panel containing components.
```json
{
  "id": "sectionIdentifier",
  "title": "Section Name",
  "open": true,
  "components": []
}
```

### Components
There is 8 component types:

#### Input
The input component can be used to display any HTML input element.
```json
{
  "id": "componentIdentifier",
  "title": "Component Name",
  "type": "text"
}
```
The type property can be any of the following:
- text
- email
- date
- datetime
- datetime-local
- time
- number
- password
- tel
- url
- color

You can also add any HTML attributes:
```json
{
  "id": "componentIdentifier",
  "title": "Component Name",
  "type": "text",
  "required": "required",
  "maxlength": 250
}
```

#### Textarea
The textarea component can be used to display an HTML textarea element.
```json
{
  "id": "componentIdentifier",
  "title": "Component Name",
  "type": "textarea"
}
```

#### WYSIWYG
The WYSIWYG component can be used to display a WYSIWYG.
This component is based on SummerNote for UI.
```json
{
  "id": "componentIdentifier",
  "title": "Component Name",
  "type": "wysiwyg"
}
```

#### Image
The image component can be used to display an image uploader.  
You can use the `multiple` attribute to allow multiple images upload and you can define the image size with `height` and `width` attributes or the a maximum image size with the `max_height` and `max_width` attributes.
```json
{
  "id": "componentIdentifier",
  "title": "Component Name",
  "type": "image",
  "multiple": "multiple",
  "max_height": 250,
  "max_width": 800
}
```

#### Dropdown
The dropdown component can be used to display an HTML select option element.  
This component is based on Select2 for UI.
```json
{
  "id": "componentIdentifier",
  "title": "Component Name",
  "type": "dropdown",
  "options": ["NodeJS", "ReactJS", "ExpressJS"],
  "multiple": true
}
```
You can also display a list of pages. To do so, you need to add a `relation` property and set it to `true` and then define templates ids in the `options` property.
For the dropdown to display correctly, don't forget to add the `toString` property on the related templates.

#### Map
The map component can be used to display a map and select locations.  
This component is based on Google Map for UI.
```json
{
  "id": "componentIdentifier",
  "title": "Component Name",
  "type": "map",
  "api_key": "YOUR_API_KEY",
  "center": {"lat": 48.099709046649394,"lng": -1.6719820609741873},
  "zoom": 9
}
```

#### Builder
The builder component can be used to display a page builder. A page builder allow a website administrator to create a responsive webpage by adding components into rows and columns.
```json
{
  "id": "componentIdentifier",
  "title": "Component Name",
  "type": "builder"
}
```

#### List
The list component can be used to display a list of elements. Those elements can be pages or just simple blocs and have to be of the same type.
```json
{
  "id": "componentIdentifier",
  "title": "Component Name",
  "type": "list",
  "template": "pageIdentifier",
  "page": false
}
```
If `page` property is set to `false`, don't forget to add the `toString` property on the related template to define the component value to display in the bloc header.
