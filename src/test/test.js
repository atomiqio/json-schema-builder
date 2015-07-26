import assert from 'assert';
import testSuite from 'json-schema-test-suite';
import * as _ from 'lodash';
import { isEqual } from './helpers';
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

function stringify(obj) {
  return JSON.stringify(obj, null, 2);
}

function test(name, description, builderFn) {
  it(name + ': ' + description, function () {
    assert(isEqual(builderFn().build(), getSchema(name, description)));
  });
}

describe('type tests', function () {

  test('type', 'integer type matches integers', () => {
    const schema = new json.Schema();
    // equivalent:
    // schema.addKeyword(new json.Type('integer'));
    schema.type = 'integer';
    return schema;
  });

  test('type', 'number type matches numbers', () => {
    const schema = new json.Schema();
    schema.type = 'number';
    return schema;
  });

  test('type', 'string type matches strings', () => {
    const schema = new json.Schema();
    schema.type = 'string';
    return schema;
  });

  test('type', 'object type matches objects', () => {
    const schema = new json.Schema();
    schema.type = 'object';
    return schema;
  });

  test('type', 'array type matches arrays', () => {
    const schema = new json.Schema();
    schema.type = 'array';
    return schema;
  });

  test('type', 'boolean type matches booleans', () => {
    const schema = new json.Schema();
    schema.type = 'boolean';
    return schema;
  });

  test('type', 'null type matches only the null object', () => {
    const schema = new json.Schema();
    schema.type = 'null';
    return schema;
  });

  test('type', 'multiple types can be specified in an array', () => {
    const schema = new json.Schema();
    schema.type = [ 'integer', 'string' ];
    return schema;
  });

});
