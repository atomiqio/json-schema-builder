import assert from 'assert';
import testSuite from 'json-schema-test-suite';
import * as _ from 'lodash';
import { isEqual, stringify } from './helpers';
import * as json from '../lib';

const draft4 = testSuite.draft4();

// TODO set to false
const verbose = true;

function print() {
  if (verbose) {
    if (typeof arguments[0] == 'object') {
      console.log(JSON.stringify(arguments[0], null, 2));
    } else {
      console.log.call(...arguments);
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

  test.skip('properties', 'properties, patternProperties, additionalProperties interaction', () => {
    const schema = json.schema();

    // TODO implement patternProperties, additionalProperties

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

  // equivalent
  test('patternProperties', 'patternProperties validates properties matching a regex', () => {
    const schema = json.schema().patternProperty({ 'f.*o': json.integer() });

    return schema;
  });

  test.skip('patternProperties', 'multiple simultaneous patternProperties are validated', () => {
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

import Type from '../lib/Type';

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

describe('allOf tests', function () {

	test('allOf', 'allOf', () => {
		const schema = json.schema()
			.allOf([
				json.schema().property('bar', json.integer(), true),
				json.schema().property('foo', json.string(), true)]);

		return schema;
	});

	//TODO: equivalent - tests non-array arguments
	test.skip('allOf', 'allOf', () => {
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

	// TODO: add maximum and minimum
	test.skip('allOf', 'allOf simple types', () => {
		const schema = json.schema()
			.allOf([
				json.schema().maximum(30),
				json.schema().minimum(20)]);

		return schema;
	});

});

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

// TODO: add maxLength, and minLength
describe('anyOf', function () {

	test('anyOf', 'anyOf', () => {
		const schema = json.schema()
			.anyOf([json.schema().integer(), json.schema().minimum(2)]);

		return schema;
	});

	// equivalent - tests non-array arguments
	test.skip('anyOf', 'anyOf', () => {
		const schema = json.schema()
			.anyOf(json.schema().integer(), json.schema().minimum(2));

		return schema;
	});

	test.skip('anyOf', 'anyOf with base schema', () => {
		const schema = json.schema()
			.string()
			.anyOf([json.schema().maxLength(2), json.schema().minLength(4)]);

		return schema;
	});

});

//TODO: add minlength, and maxLength
describe('oneOf', function () {

  test('oneOf', 'oneOf', () => {
    const schema = json.schema()
        .oneOf([json.schema().integer(), json.schema().minimum(2)]);

    return schema;
  });

	//equivalent - tests non-array arguments
	test.skip('oneOf', 'oneOf', () => {
		const schema = json.schema()
			.oneOf(json.schema().integer(), json.schema().minimum(2));

		return schema;
	});

	test.skip('oneOf', 'oneOf with base schema', () => {
		const schema = json.schema()
				.string()
				.oneOf([json.schema().minLength(2), json.schema().maxLength(4)]);

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
