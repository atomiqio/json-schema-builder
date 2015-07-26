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

describe('type tests', function () {

  test('type', 'integer type matches integers', () => {
    const schema = new json.Schema();
    // equivalent:
    // schema.addKeyword(new json.Type('integer'));
    schema.type = 'integer';
    assert(schema.type, 'integer');
    return schema;
  });

  test('type', 'number type matches numbers', () => {
    const schema = new json.Schema();
    schema.type = 'number';
    assert(schema.type, 'number');
    return schema;
  });

  test('type', 'string type matches strings', () => {
    const schema = new json.Schema();
    schema.type = 'string';
    assert(schema.type, 'string');
    return schema;
  });

  test('type', 'object type matches objects', () => {
    const schema = new json.Schema();
    schema.type = 'object';
    assert(schema.type, 'object');
    return schema;
  });

  test('type', 'array type matches arrays', () => {
    const schema = new json.Schema();
    schema.type = 'array';
    assert(schema.type, 'array');
    return schema;
  });

  test('type', 'boolean type matches booleans', () => {
    const schema = new json.Schema();
    schema.type = 'boolean';
    assert(schema.type, 'boolean');
    return schema;
  });

  test('type', 'null type matches only the null object', () => {
    const schema = new json.Schema();
    schema.type = 'null';
    assert(schema.type, 'null');
    return schema;
  });

  test('type', 'multiple types can be specified in an array', () => {
    const schema = new json.Schema();
    schema.type = ['integer', 'string'];
    return schema;
  });

});

describe('enum tests', function () {

  test('enum', 'simple enum validation', () => {
    const schema = new json.Schema();
    schema.enum = [1, 2, 3];
    assert(schema.enum, [1, 2, 3]);
    return schema;
  });

  test('enum', 'heterogeneous enum validation', () => {
    const schema = new json.Schema();
    schema.enum = [6, "foo", [], true, { "foo": 12 }];
    assert(schema.enum, [6, "foo", [], true, { "foo": 12 }]);
    return schema;
  });

  test('enum', 'enums in properties', () => {
    const schema = new json.Schema();
    schema.type = 'object';

    schema.required = ['bar'];
    schema.properties = {
      foo: { enum: ['foo'] },
      bar: { enum: ['bar'] }
    }

    return schema;
  });

  test('enum', 'enums in properties', () => {
    const schema = new json.Schema();
    schema.type = 'object';

    schema.addProperty('foo', new json.Enum('foo'));
    schema.addProperty('bar', new json.Enum('bar'), true);

    return schema;
  });

  test('enum', 'enums in properties', () => {
    const schema = new json.Schema();
    schema.type = 'object';

    schema.addProperty({ foo: new json.Enum('foo')});
    schema.addProperty({ bar: new json.Enum('bar')}, true);

    return schema;
  });
});