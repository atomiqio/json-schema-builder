import assert from 'assert';
import testSuite from 'json-schema-test-suite';
import * as _ from 'lodash';
import { isEqual, stringify } from './helpers';
import * as json from '../lib';

const draft4 = testSuite.draft4();

function getTestSection(name, description) {
  const group = _.findWhere(draft4, { name: name });
  if (!group) throw new Error("can't find schema for: " + name);
  const section = _.findWhere(group.schemas, { description: description });
  if (!section) throw new Error("can't find section for: " + name + ' => ' + description);
  return section;
}

function getSchema(name, description) {
  return getTestSection(name, description).schema;
}

function test(name, description, builderFn) {
  it(name + ': ' + description, function () {
    var expected = getSchema(name, description);
    var actual = builderFn().build();

    if (!isEqual(actual, expected)) {
      console.log('==============================');
      console.log('expected =>');
      console.log(stringify(expected));
      console.log('------------------------------');
      console.log('actual =>');
      console.log(stringify(actual));
    }

    assert(isEqual(actual, expected));
  });
}

test.skip = function () {
  it.skip(arguments[0] + ' => ' + arguments[1], function () {});
}

describe('properties', function () {

  test('properties', 'object properties validation', () => {
    const schema = json.schema();

    schema.properties = {
      foo: json.integer(),
      bar: json.string()
    };

    return schema;
  });

  // equivalent
  test('properties', 'object properties validation', () => {
    const schema = json.schema()
        .property('foo', json.integer() )
        .property('bar', json.string());

    return schema;
  });

  test.skip('properties', 'properties, patternProperties, additionalProperties interaction', () => {
    const schema = json.schema();

    // TODO implement patterProperties, additionalProperties

    return schema;
  });
});

describe('patternProperties', function () {

  test('patternProperties', 'patternProperties validates properties matching a regex', () => {
    const schema = json.schema();

    schema.patternProperties = {
      'f.*o': json.integer()
    };

    return schema;
  });

  // equivalent
  test('patternProperties', 'patternProperties validates properties matching a regex', () => {
    const schema = json.schema();

    schema.addPatternProperty('f.*o', json.integer());

    return schema;
  });

  // equivalent
  test('patternProperties', 'patternProperties validates properties matching a regex', () => {
    const schema = json.schema();

    schema.addPatternProperty({ 'f.*o': json.integer() });

    return schema;
  });

  test.skip('patternProperties', 'multiple simultaneous patternProperties are validated', () => {
  });

  test('patternProperties', 'regexes are not anchored by default and are case sensitive', () => {
    const schema = json.schema();

    schema.addPatternProperty('[0-9]{2,}', json.boolean());
    schema.addPatternProperty('X_', json.string());

    return schema;
  });
});

describe('additionalProperties', function () {

  test('additionalProperties', 'additionalProperties being false does not allow other properties', () => {
    const schema = json.schema();

    schema.properties = {
      foo: {},
      bar: {}
    };

    schema.patternProperties = {
      '^v': {}
    };

    schema.additionalProperties = false;

    return schema;
  });

  test('additionalProperties', 'additionalProperties allows a schema which should validate', () => {
    const schema = json.schema();

    schema.properties = {
      foo: {},
      bar: {}
    };

    schema.additionalProperties = json.schema().boolean();

    return schema;
  });
});

describe('type', function () {

  test('type', 'integer type matches integers', () => {
    const schema = json.schema()
        .integer();

    assert.equal(schema.type(), 'integer');
    return schema;
  });

  test('type', 'number type matches numbers', () => {
    const schema = json.schema()
        .number();

    assert.equal(schema.type(), 'number');
    return schema;
  });

  test('type', 'string type matches strings', () => {
    const schema = json.schema()
        .string();

    assert.equal(schema.type(), 'string');
    return schema;
  });

  test('type', 'object type matches objects', () => {
    const schema = json.schema()
        .object();

    assert(schema.type, 'object');
    return schema;
  });

  test('type', 'array type matches arrays', () => {
    const schema = json.schema()
        .array();

    assert(schema.type, 'array');
    return schema;
  });

  test('type', 'boolean type matches booleans', () => {
    const schema = json.schema()
        .boolean();

    assert(schema.type, 'boolean');
    return schema;
  });

  test('type', 'null type matches only the null object', () => {
    const schema = json.schema()
        .null();

    assert(schema.type, 'null');
    return schema;
  });

  test('type', 'multiple types can be specified in an array', () => {
    const schema = json.schema()
        .type(['integer', 'string']);
    return schema;
  });

});

describe('enum', function () {

  test('enum', 'simple enum validation', () => {
    const schema = json.schema()
        .enum([1, 2, 3]);

    assert(schema.enum, [1, 2, 3]);
    return schema;
  });

  test('enum', 'heterogeneous enum validation', () => {
    const schema = json.schema()
        .enum([6, "foo", [], true, { "foo": 12 }]);

    assert(schema.enum, [6, "foo", [], true, { "foo": 12 }]);
    return schema;
  });

  test('enum', 'enums in properties', () => {
    const schema = json.schema()
        .type('object');

    schema.required = ['bar'];
    schema.properties = {
      foo: json.enum('foo'),
      bar: json.enum('bar')
    }

    return schema;
  });

  // equivalent (adding properties constructed with name and value)
  test('enum', 'enums in properties', () => {
    const schema = json.schema()
        .object()
        .property('foo', json.enum('foo'))
        .property('bar', json.enum('bar'), true);

    return schema;
  });

  // equivalent (adding properties constructed with objects)
  test('enum', 'enums in properties', () => {
    const schema = json.schema()
        .object()
        .property({ foo: json.enum('foo') })
        .property({ bar: json.enum('bar') }, true);

    return schema;
  });
});

