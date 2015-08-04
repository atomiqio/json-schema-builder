json-schema-builder
===================

[![NPM](https://nodei.co/npm/json-schema-builder.png?compact=true)](https://nodei.co/npm/json-schema-builder/)

Create syntactically correct [JSON Schema](http://json-schema.org/) with a fluent JavaScript API.

    npm install --save json-schema-builder
    
See the [wiki](https://github.com/atomiqio/json-schema-builder/wiki) and [tests](https://github.com/atomiqio/json-schema-builder/blob/master/src/test/test.js) for documentation and examples.


Basic Usage
-----------
    
Use json-schema-builder to create an empty schema object:

    var jsb = require('json-schema-builder');
    var schema = jsb.schema();

Use `.json()` on any JSON schema builder object to generate actual JSON Schema: 

    var doc = schema.json()

At this point, `doc` is just an empty schema (`{}`) that can be used by a JSON Schema validator to match any JSON instance (a JSON instance is any data in valid JSON format).


#### Add a validation constraint to any schema

Schemas can have validation constraints that restrict the set of JSON instances that can match a schema. There are constraints that apply to any schema.

One such constraint is `type`. For schemas that have a `type` constraint, there are *additional* constraints that can be applied depending on whether the type is numeric (`number` or `integer`), `string`, `array`, or `object`.


##### type constraint for any schema

    var schema = jsb.schema().type( <value> )
    
where `value` is a string specifying any valid JSON Schema type (`boolean`, `integer`, `number`, `string`, `array`, `object`, and `null`).

Unless creating an empty schema as shown in the previous section, it is **not** necessary to explicitly invoke `schema()` as shown here. The following example shows the equivalent (and preferred) form:
    
    var schema = jsb.type('string')
    
The `type` constraint can be used to restrict JSON instances to a particular set of acceptable types. The following example demonstrates how to specify a list of types that could be used to validate JSON instances that are either integer or string values:

    var schema = jsb.type( 'integer', 'string' );

    
`type` has convenient wrappers corresponding to all the valid JSON Schema types:
    
    var integerSchema = jsb.integer();  // jsb.type('integer')
    var numberSchema  = jsb.number();   // jsb.type('number')
    var booleanSchema = jsb.boolean();  // jsb.type('boolean')
    var stringSchema  = jsb.string();   // jsb.type('string')
    var arraySchema   = jsb.array();    // jsb.type('array')
    var objectSchema  = jsb.object();   // jsb.type('object')
    var nullSchema    = jsb.null();     // jsb.type('null')
    
Using `integerSchema` from this example, `integerSchema.json()` would generate the following JSON Schema document (or fragment):

    {
      "type": "integer"
    }

This schema can be used by a validator to match any integer JSON instance (any number without a fraction or exponent part).

##### Additional constraints for any schema

In addition to the `type` constraints, other constraints that can be applied to any schema include `enum`, `allOf`, `anyOf`, `oneOf`, and `not`.

See [Validation for any instance type](https://github.com/atomiqio/json-schema-builder/wiki/Any).

##### Constraints for numeric types

The following constraints can be applied to numeric types: `multipleOf`, `maximum` and `exclusiveMaximum`, and `minimum` and `exclusiveMinimum`.

See [Validation for numeric types](https://github.com/atomiqio/json-schema-builder/wiki/Numeric).

##### Constraints for string types

The following constraints can be applied to string types: `maxLength`, `minLength`, and `pattern`.

See [Validation for string types](https://github.com/atomiqio/json-schema-builder/wiki/String).


##### Constraints for array types

The following constraints can be applied to array types: `additionalItems and items`, `maxItems`, `minItems`, and `uniqueItems`.

See [Validation for array types](https://github.com/atomiqio/json-schema-builder/wiki/Array).


##### Constraints for object types

The following constraints can be applied to object types: `maxProperties`, `minProperties`, `required`, `additionalProperties`, `properties`, `patternProperties`, and `dependencies`.

See [Validation for object types](https://github.com/atomiqio/json-schema-builder/wiki/Object).


### Saving a schema to file

There is a convenience `save` method for saving a schema to a file. It generates output as JSON Schema and saves it as a UTF-8, formatted JSON file with 2-space indentation.
    

    // save to a file synchronously
    schema.save(path, to, filename);
    
    // save to a file asynchronously
    schema.save(filename, function(err) {
      ...
    });

Of course, the output from `schema.json()` can be explicitly persisted any way desired.

Tests
-----

    npm test

`json-schema-builder` provides [tests](https://github.com/atomiqio/json-schema-builder/blob/master/src/test/test.js) to verify the API can generate all the schemas that comprise the standard [JSON Schema Test Suite](https://github.com/json-schema/JSON-Schema-Test-Suite).
