# FlexibleJS
FlexibleJS is based on NodeJS, ExpressJS, ReactJS and Mongodb. It makes creating a website backend really easy (with only one JSON config file).

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
  "id": "site-identifier",
  "title": "Site Name",
  "lang": ["fr", "en"],
  "templates": []
}
```

### Page Template
Inside a website, you can add page templates. Each template is described with the following object:
```json
{
  "id": "page-identifier",
  "title": "Page Name",
  "seo": true,
  "components": []
}
```
And then inside a page template, you can define a list of components.

### Components
There is 7 component types:

#### Input
The input component can be used to display any HTML input element.
```json
{
  "id": "component-identifier",
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
  "id": "component-identifier",
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
  "id": "component-identifier",
  "title": "Component Name",
  "type": "textarea"
}
```

#### WYSIWYG
The WYSIWYG component can be used to display a WYSIWYG.
This component is based on SummerNote for UI.
```json
{
  "id": "component-identifier",
  "title": "Component Name",
  "type": "wysiwyg"
}
```

#### Image
The image component can be used to display an image uploader.
```json
{
  "id": "component-identifier",
  "title": "Component Name",
  "type": "image"
}
```

You can upload multiple images by adding the multiple property:
```json
{
  "id": "component-identifier",
  "title": "Component Name",
  "type": "image",
  "multiple": "multiple"
}
```

#### Dropdown
The dropdown component can be used to display an HTML select option element.  
This component is based on Select2 for UI.
```json
{
  "id": "component-identifier",
  "title": "Component Name",
  "type": "dropdown",
  "options": ["NodeJS", "ReactJS", "ExpressJS"]
}
```

#### Map
The map component can be used to display a map and select locations.  
This component is based on Google Map for UI.
```json
{
  "id": "component-identifier",
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
  "id": "component-identifier",
  "title": "Component Name",
  "type": "builder"
}
```

#### List
The list component can be used to display a list of elements. Those elements are pages and have to be of the same type.
```json
{
  "id": "component-identifier",
  "title": "Component Name",
  "type": "list",
  "template": "page-identifier"
}
```
