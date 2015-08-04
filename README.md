json-schema-builder
===================

[![NPM](https://nodei.co/npm/json-schema-builder.png?compact=true)](https://nodei.co/npm/json-schema-builder/)

Create [JSON Schema](http://json-schema.org/) with a fluent JavaScript API.

    npm install --save json-schema-builder
    
See the [wiki](https://github.com/atomiqio/json-schema-builder/wiki) and [tests](https://github.com/atomiqio/json-schema-builder/blob/master/src/test/test.js) for documentation and examples.

Examples
--------

### Create an empty schema

```
var json = require('json-schema-builder');

// create a schema    
var schema = json.schema();
    
// get the JSON Schema document
var doc = schema.json();
```

The result matches any JSON data:

    {}


There is a convenience method for saving a schema to a file
    
```
// save to a file synchronously
schema.save(path, to, filename);
    
// save to a file asynchronously
schema.save(filename, function(err) {
  ...
});
```



### Specify a property

```
var schema = json.property('foo');
```

Generates

```
{
  "properties": {
    "foo": {}
  }
}
```

Matches any of the following

```
{}

{
  "foo": 1
}

{
  "foo": "hello",
  "bar": "world
}
```



#### Specify schema type explicitly and a property

```
var schema = json.object().property('foo');
```

Generates

```
{
  "type": "object",
  "properties": {
    "foo": {}
  }
}
```

Matches the same as the previous example.



#### Specify that any property value is allowed explicitly

```
var schema = json.object().property('foo', {});
```

Generates the same as the previous example.

Matches the same as the previous example.



#### Specify that additional properties are allowed explicitly

```
var schema = json.object()
  .property('foo', {})
  .additionalProperties(true);
```

Generates

```
{
  "type": "object",
  "properties": {
    "foo": {}
  },
  "additionalProperties": true
}
```

Matches the same as the previous example.



#### Specify that additional properties are allowed explicitly

```
var schema = json.object()
  .property('foo', {})
  .additionalProperties(true);
```

Generates

```
{
  "type": "object",
  "properties": {
    "foo": {}
  },
  "additionalProperties": true
}
```

Matches the same as the previous example.



#### Specify that additional properties are not allowed

```
var schema = json.object()
  .property('foo', {})
  .additionalProperties(false);
```

Generates

```
{
  "type": "object",
  "properties": {
    "foo": {}
  },
  "additionalProperties": false
}
```

Matches

```
{}

{
  "foo": 1
}
```


#### Specify that the property is required, and no others are allowed


```
var schema = json.object()
  .property('foo', {}, true)
  .additionalProperties(false);
```

or

```
var schema = json.object()
  .property('foo')
  .required('foo')
  .additionalProperties(false);
```

Generates

```
{
  "type": "object",
  "properties": {
    "foo": {}
  },
  "required": [ "foo" ],
  "additionalProperties": false
}
```

Matches

```
{
  "foo": 1
}
```

#### Specify property type explicitly

Use optional flag to specify if property is required (default is `false`).

```
var schema = json
  .property('foo', json.string(), true)
  .property('bar', json.integer());
```

Generates

```
{
  "properties": {
    "foo": { "type": "string" },
    "bar": { "type": "integer" }
  },
  "required": [ "foo" ]
}
```


