import assert from 'assert';
import testSuite from 'json-schema-test-suite';
import * as _ from 'lodash';
import { isEqual, stringify } from './helpers';
import * as json from '../lib';

const draft4 = testSuite.draft4();

const verbose = false;

function print() {
  if (verbose) {
    if (typeof arguments[0] == 'object') {
      console.log(JSON.stringify(arguments[0], null, 2));
    } else {
      console.log(...arguments);
    }
  }
}

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
    try {
      const expected = getSchema(name, description);
      const actual = builderFn().build();

      if (!isEqual(actual, expected) || verbose) {
        print('==============================');
        print('expected =>');
        print(expected);
        print('------------------------------');
        print('actual =>');
        print(actual);
      }

      assert(isEqual(actual, expected));
    } catch (err) {
      print('==============================');
      print('Uncaught error for: %s => %s', name, description);
      throw err;
    }
  });
}

test.skip = function () {
  it.skip(arguments[0] + ' => ' + arguments[1], function () {});
}

describe('generic keywords (any instance type)', () => {

  describe('enum', function () {

    test('enum', 'simple enum validation', () => {
      const schema = json.schema().enum([1, 2, 3]);
      assert(schema.enum, [1, 2, 3]);
      return schema;
    });

    test('enum', 'heterogeneous enum validation', () => {
      const schema = json.schema().enum([6, "foo", [], true, { "foo": 12 }]);
      assert(schema.enum, [6, "foo", [], true, { "foo": 12 }]);
      return schema;
    });

    test('enum', 'enums in properties', () => {
      const schema = json.schema()
          .type('object')
          .required(['bar'])
          .properties({
            foo: json.enum('foo'),
            bar: json.enum('bar')
          });

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

  describe('type', function () {

    test('type', 'integer type matches integers', () => {
      const schema = json.schema().integer();
      assert.equal(schema.type(), 'integer');
      return schema;
    });

    test('type', 'number type matches numbers', () => {
      const schema = json.schema().number();
      assert.equal(schema.type(), 'number');
      return schema;
    });

    test('type', 'string type matches strings', () => {
      const schema = json.schema().string();
      assert.equal(schema.type(), 'string');
      return schema;
    });

    test('type', 'object type matches objects', () => {
      const schema = json.schema().object();
      assert(schema.type, 'object');
      return schema;
    });

    test('type', 'array type matches arrays', () => {
      const schema = json.schema().array();
      assert(schema.type, 'array');
      return schema;
    });

    test('type', 'boolean type matches booleans', () => {
      const schema = json.schema().boolean();
      assert(schema.type, 'boolean');
      return schema;
    });

    test('type', 'null type matches only the null object', () => {
      const schema = json.schema().null();
      assert(schema.type, 'null');
      return schema;
    });

    test('type', 'multiple types can be specified in an array', () => {
      const schema = json.schema().type(['integer', 'string']);
      return schema;
    });

  });

  describe('allOf tests', function () {

    test('allOf', 'allOf', () => {
      const schema = json.schema()
          .allOf([
            json.schema().property('bar', json.integer(), true),
            json.schema().property('foo', json.string(), true)]);

      return schema;
    });

    test('allOf', 'allOf', () => {
      const schema = json.schema()
          .allOf(
          json.schema().property('bar', json.integer(), true),
          json.schema().property('foo', json.string(), true)
      );

      return schema;
    });

    test('allOf', 'allOf with base schema', () => {
      const schema = json.schema()
          .property('bar', json.integer(), true)
          .allOf([
            json.schema().property('foo', json.string(), true),
            json.schema().property('baz', json.null(), true)]);

      return schema;
    });

    test('allOf', 'allOf simple types', () => {
      const schema = json.schema()
          .allOf([
            json.schema().maximum(30),
            json.schema().minimum(20)]);

      return schema;
    });

  });

  describe('anyOf', function () {

    test('anyOf', 'anyOf', () => {
      const schema = json.schema()
          .anyOf([json.schema().integer(), json.schema().minimum(2)]);

      return schema;
    });

    test('anyOf', 'anyOf', () => {
      const schema = json.schema()
          .anyOf(json.schema().integer(), json.schema().minimum(2));

      return schema;
    });

    test('anyOf', 'anyOf with base schema', () => {
      const schema = json.schema()
          .string()
          .anyOf([json.schema().maxLength(2), json.schema().minLength(4)]);

      return schema;
    });

  });

  describe('oneOf', function () {

    test('oneOf', 'oneOf', () => {
      const schema = json.schema()
          .oneOf([json.schema().integer(), json.schema().minimum(2)]);

      return schema;
    });

    test('oneOf', 'oneOf', () => {
      const schema = json.schema()
          .oneOf(json.schema().integer(), json.schema().minimum(2));

      return schema;
    });

    test('oneOf', 'oneOf with base schema', () => {
      const schema = json.schema()
          .string()
          .oneOf([json.schema().minLength(2), json.schema().maxLength(4)]);

      return schema;
    });

  });

  describe('not', function () {

    test('not', 'not', () => {
      const schema = json.schema()
          .not(json.schema().integer());

      return schema;
    });

  });

  describe('type', function () {

    test('not', 'not multiple types', () => {
      const schema = json.schema()
          .not(json.schema().type(['integer', 'boolean']));

      return schema;
    });

    test('not', 'not more complex schema', () => {
      const schema = json.schema()
          .not(json.schema().object().property('foo', json.string()));

      return schema;
    });

    test('not', 'forbidden property', () => {
      const schema = json.schema()
          .property('foo', json.schema().not(json.schema()));

      return schema;
    });

  });

});

describe('object keywords', () => {

  describe('dependencies', () => {

    test('dependencies', 'dependencies', () => {
      const schema = json.schema()
          .dependencies({ 'bar': ['foo'] });

      return schema;
    });

    test('dependencies', 'multiple dependencies', () => {
      const schema = json.schema()
          .dependencies({ 'quux': ['foo', 'bar'] });

      return schema;
    });

  });

  describe('properties', function () {

    test('properties', 'object properties validation', () => {
      const schema = json.schema()
          .properties({
            foo: json.integer(),
            bar: json.string()
          });

      return schema;
    });

    // equivalent
    test('properties', 'object properties validation', () => {
      const schema = json.schema()
          .property('foo', json.integer())
          .property('bar', json.string());

      return schema;
    });

    test('properties', 'properties, patternProperties, additionalProperties interaction', () => {
      // PAY ATTENTION to the values being schemas to build properly
      const schema = json.schema()
          .property('foo', json.schema().array().maxItems(3))
          .property('bar', json.array())
          .patternProperty('f.o', json.schema().minItems(2))
          .additionalProperties(json.schema().integer());

      return schema;
    });
  });

  describe('patternProperties', function () {

    test('patternProperties', 'patternProperties validates properties matching a regex', () => {
      const schema = json.schema().patternProperties({ 'f.*o': json.integer() });

      return schema;
    });

    // equivalent
    test('patternProperties', 'patternProperties validates properties matching a regex', () => {
      const schema = json.schema().patternProperty('f.*o', json.integer());

      return schema;
    });

    test('patternProperties', 'multiple simultaneous patternProperties are validated', () => {
      const schema = json.schema()
          .patternProperty('a*', json.integer())
          .patternProperty('aaa*', json.maximum(20))
      return schema;
    });

    test('patternProperties', 'regexes are not anchored by default and are case sensitive', () => {
      const schema = json.schema()
          .patternProperty('[0-9]{2,}', json.boolean())
          .patternProperty('X_', json.string());

      return schema;
    });
  });

  describe('additionalProperties', function () {

    test('additionalProperties', 'additionalProperties being false does not allow other properties', () => {
      const schema = json.schema()
          .properties({
            foo: {},
            bar: {}
          })
          .patternProperties({
            '^v': {}
          })
          .additionalProperties(false);

      return schema;
    });

    test('additionalProperties', 'additionalProperties allows a schema which should validate', () => {
      const schema = json.schema()
          .properties({
            foo: {},
            bar: {}
          })
          .additionalProperties(json.schema().boolean());

      return schema;
    });

    test('additionalProperties', 'additionalProperties are allowed by default', () => {
      const schema = json.schema()
          .properties({
            foo: {},
            bar: {}
          });

      return schema;
    });

  });

  test('maxProperties', 'maxProperties validation', () => {
    const schema = json.schema().maxProperties(2);
    return schema;
  });

  test('minProperties', 'minProperties validation', () => {
    const schema = json.schema().minProperties(1);
    return schema;
  });

  test('required', 'required validation', () => {
    const schema = json.schema()
        .property('foo', {}, true)
        .property('bar', {});
    return schema;
  });

  describe('definitions', () => {

    test('definitions', 'valid definition', () => {
      const schema = json.schema().$ref('http://json-schema.org/draft-04/schema#');
      return schema;
    });

    test('definitions', 'valid definition', () => {
      const schema = json.schema().$ref('http://json-schema.org/draft-04/schema#');
      return schema;
    });

  });
});

describe('numeric keywords', () => {

  describe('multipleOf', function () {

    test('multipleOf', 'by int', () => {
      const schema = json.schema()
          .multipleOf(2);

      return schema;
    });

    test('multipleOf', 'by number', () => {
      const schema = json.schema()
          .multipleOf(1.5);

      return schema;
    });

    test('multipleOf', 'by small number', () => {
      const schema = json.schema()
          .multipleOf(0.0001);

      return schema;
    });

  });

  describe('maximum and exclusiveMaximum', function () {

    test('maximum', 'maximum validation', () => {
      const schema = json.schema()
          .maximum(3.0);

      return schema;
    });

    test('maximum', 'exclusiveMaximum validation', () => {
      const schema = json.schema()
          .maximum(3.0)
          .exclusiveMaximum(true);

      return schema;
    });

  });

  describe('minimum and exclusiveMinimum', function () {

    test('minimum', 'minimum validation', () => {
      const schema = json.schema()
          .minimum(1.1);

      return schema;
    });

    test('minimum', 'exclusiveMinimum validation', () => {
      const schema = json.schema()
          .minimum(1.1)
          .exclusiveMinimum(true);

      return schema;
    });

  });

});

describe('array keywords', () => {

  test('items', 'a schema given for items', () => {
    const schema = json.schema()
      //TODO: implement helper function for returning valid schema for given type
        .items(json.schema().integer());

    return schema;
  });

  test('items', 'an array of schemas for items', () => {
    const schema = json.schema()
        .items([json.schema().integer(), json.schema().string()]);

    return schema;
  });

  test('additionalItems', 'additionalItems as schema', () => {
    const schema = json.schema()
        .items([json.schema()])
        .additionalItems(json.schema().integer());

    return schema;
  });

  test('additionalItems', 'items is schema, no additionalItems', () => {
    const schema = json.schema()
        .items(json.schema())
        .additionalItems(false);

    return schema;
  });

  test('additionalItems', 'array of items with no additionalItems', () => {
    const schema = json.schema()
        .items([json.schema(), json.schema(), json.schema()])
        .additionalItems(false);

    return schema;
  });

  test('additionalItems', 'additionalItems as false without items', () => {
    const schema = json.schema().additionalItems(false);
    return schema;
  });

  test('additionalItems', 'additionalItems are allowed by default', () => {
    const schema = json.schema()
        .items([json.schema().integer()]);
    return schema;
  });

  test('maxItems', 'maxItems validation', () => {
    const schema = json.schema().maxItems(2);
    return schema;
  });

  test('minItems', 'minItems validation', () => {
    const schema = json.schema().minItems(1);
    return schema;
  });

  test('uniqueItems', 'uniqueItems validation', () => {
    const schema = json.schema().uniqueItems(true);
    return schema;
  });

});

describe('string keywords', () => {

  test('maxLength', 'maxLength validation', () => {
    const schema = json.schema().maxLength(2);
    return schema;
  });

  test('minLength', 'minLength validation', () => {
    const schema = json.schema().minLength(2);
    return schema;
  });


  test('pattern', 'pattern validation', () => {
    const schema = json.schema().pattern('^a*$');
    return schema;
  });

  test('pattern', 'pattern is not anchored', () => {
    const schema = json.schema().pattern('a+');
    return schema;
  });

});

