import assert from 'assert';
import testSuite from 'json-schema-test-suite';
import * as _ from 'lodash';
import { isEqual, stringify } from './helpers';
import * as json from '../lib';
import { mkdirSync } from 'fs';
import { join } from 'path';
import del from 'del';

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
      const actual = builderFn().json();

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

describe ('Tests based on standard JSON Schema Test Suite', () => {

  describe('generic keywords (any instance type)', () => {

    describe('enum', () => {

      test('enum', 'simple enum validation', () => {
        const schema = json.enum([1, 2, 3]);
        assert(schema.enum, [1, 2, 3]);
        return schema;
      });

      // equivalent
      test('enum', 'simple enum validation', () => {
        const schema = json.enum(1, 2, 3);
        assert(schema.enum, [1, 2, 3]);
        return schema;
      });

      test('enum', 'heterogeneous enum validation', () => {
        const schema = json.enum([6, "foo", [], true, { "foo": 12 }]);
        assert(schema.enum, [6, "foo", [], true, { "foo": 12 }]);
        return schema;
      });

      test('enum', 'enums in properties', () => {
        const schema = json
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
        const schema = json
            .object()
            .property('foo', json.enum('foo'))
            .property('bar', json.enum('bar'), true);

        return schema;
      });

      // equivalent (adding properties constructed with objects)
      test('enum', 'enums in properties', () => {
        const schema = json
            .object()
            .property({ foo: json.enum('foo') })
            .property({ bar: json.enum('bar') }, true);

        return schema;
      });
    });

    describe('type', () => {

      test('type', 'integer type matches integers', () => {
        const schema = json.integer();
        assert.equal(schema.type(), 'integer');
        return schema;
      });

      test('type', 'number type matches numbers', () => {
        const schema = json.number();
        assert.equal(schema.type(), 'number');
        return schema;
      });

      test('type', 'string type matches strings', () => {
        const schema = json.string();
        assert.equal(schema.type(), 'string');
        return schema;
      });

      test('type', 'object type matches objects', () => {
        const schema = json.object();
        assert(schema.type, 'object');
        return schema;
      });

      test('type', 'array type matches arrays', () => {
        const schema = json.array();
        print(schema);
        assert(schema.type, 'array');
        return schema;
      });

      test('type', 'boolean type matches booleans', () => {
        const schema = json.boolean();
        assert(schema.type, 'boolean');
        return schema;
      });

      test('type', 'null type matches only the null object', () => {
        const schema = json.null();
        assert(schema.type, 'null');
        return schema;
      });

      test('type', 'multiple types can be specified in an array', () => {
        const schema = json.type(['integer', 'string']);
        return schema;
      });

    });

    describe('allOf tests', () => {

      test('allOf', 'allOf', () => {
        const schema = json.allOf([
          json.property('bar', json.integer(), true),
          json.property('foo', json.string(), true)]);

        return schema;
      });

      test('allOf', 'allOf', () => {
        const schema = json.allOf(
            json.property('bar', json.integer(), true),
            json.property('foo', json.string(), true));

        return schema;
      });

      test('allOf', 'allOf with base schema', () => {
        const schema = json
            .allOf([
              json.property('foo', json.string(), true),
              json.property('baz', json.null(), true)])
            .property('bar', json.integer(), true);

        return schema;
      });

      test('allOf', 'allOf simple types', () => {
        const schema = json.allOf([
          json.maximum(30),
          json.minimum(20)]);

        return schema;
      });

    });

    describe('anyOf', () => {

      test('anyOf', 'anyOf', () => {
        const schema = json.anyOf([json.integer(), json.minimum(2)]);
        return schema;
      });

      // equivalent
      test('anyOf', 'anyOf', () => {
        const schema = json.anyOf(json.integer(), json.minimum(2));
        return schema;
      });

      test('anyOf', 'anyOf with base schema', () => {
        const schema = json.string().anyOf([json.maxLength(2), json.minLength(4)]);
        return schema;
      });

    });

    describe('oneOf', () => {

      test('oneOf', 'oneOf', () => {
        const schema = json.oneOf([json.integer(), json.minimum(2)]);
        return schema;
      });

      // equivalent
      test('oneOf', 'oneOf', () => {
        const schema = json.oneOf(json.integer(), json.minimum(2));
        return schema;
      });

      test('oneOf', 'oneOf with base schema', () => {
        const schema = json.string().oneOf(json.minLength(2), json.maxLength(4));
        return schema;
      });

    });

    describe('not', () => {

      test('not', 'not', () => {
        const schema = json.not(json.integer());
        return schema;
      });

    });

    describe('type', () => {

      test('not', 'not multiple types', () => {
        const schema = json.not(json.type('integer', 'boolean'));

        return schema;
      });

      test('not', 'not more complex schema', () => {
        const schema = json.not(json.object().property('foo', json.string()));
        return schema;
      });

      test('not', 'forbidden property', () => {
        const schema = json.property('foo', json.not(json.schema()));
        return schema;
      });

    });

  });

  describe('object keywords', () => {

    describe('dependencies', () => {

      test('dependencies', 'dependencies', () => {
        const schema = json.dependencies({ 'bar': ['foo'] });
        return schema;
      });

      test('dependencies', 'multiple dependencies', () => {
        const schema = json.dependencies({ 'quux': ['foo', 'bar'] });
        return schema;
      });

      test('dependencies', 'multiple dependencies subschema', ()=> {
        const schema = json.dependencies({
          bar: json.properties({
            foo: json.integer(),
            bar: json.integer()
          })
        });

        return schema;
      });

    });

    describe('properties', () => {

      test('properties', 'object properties validation', () => {
        const schema = json.properties({
          foo: json.integer(),
          bar: json.string()
        });

        return schema;
      });

      // equivalent
      test('properties', 'object properties validation', () => {
        const schema = json
            .property('foo', json.integer())
            .property('bar', json.string());

        return schema;
      });

      test('properties', 'properties, patternProperties, additionalProperties interaction', () => {
        const schema = json
            .property('foo', json.array().maxItems(3))
            .property('bar', json.array())
            .patternProperty('f.o', json.minItems(2))
            .additionalProperties(json.integer());

        return schema;
      });
    });

    describe('patternProperties', () => {

      test('patternProperties', 'patternProperties validates properties matching a regex', () => {
        const schema = json.patternProperties({ 'f.*o': json.integer() });
        return schema;
      });

      // equivalent
      test('patternProperties', 'patternProperties validates properties matching a regex', () => {
        const schema = json.patternProperty('f.*o', json.integer());
        return schema;
      });

      // equivalent
      test('patternProperties', 'patternProperties validates properties matching a regex', () => {
        const schema = json.patternProperty({ 'f.*o': json.integer() });
        return schema;
      });

      test('patternProperties', 'multiple simultaneous patternProperties are validated', () => {
        const schema = json
            .patternProperty('a*', json.integer())
            .patternProperty('aaa*', json.maximum(20))
        return schema;
      });

      test('patternProperties', 'regexes are not anchored by default and are case sensitive', () => {
        const schema = json
            .patternProperty('[0-9]{2,}', json.boolean())
            .patternProperty('X_', json.string());

        return schema;
      });
    });

    describe('additionalProperties', () => {

      test('additionalProperties', 'additionalProperties being false does not allow other properties', () => {
        const schema = json
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
        const schema = json
            .properties({
              foo: {},
              bar: {}
            })
            .additionalProperties(json.schema().boolean());

        return schema;
      });

      test('additionalProperties', 'additionalProperties can exist by itself', () => {
        const schema = json.additionalProperties(json.boolean());
        return schema;
      });

      test('additionalProperties', 'additionalProperties are allowed by default', () => {
        const schema = json
            .properties({
              foo: {},
              bar: {}
            });

        return schema;
      });

    });

    test('maxProperties', 'maxProperties validation', () => {
      const schema = json.maxProperties(2);
      return schema;
    });

    test('minProperties', 'minProperties validation', () => {
      const schema = json.minProperties(1);
      return schema;
    });

    test('required', 'required validation', () => {
      const schema = json
          .property('foo', {}, true)
          .property('bar', {});
      return schema;
    });

    describe('definitions', () => {

      test('definitions', 'valid definition', () => {
        const schema = json.$ref('http://json-schema.org/draft-04/schema#');
        return schema;
      });

      test('definitions', 'valid definition', () => {
        const schema = json.$ref('http://json-schema.org/draft-04/schema#');
        return schema;
      });

    });
  });

  describe('numeric keywords', () => {

    describe('multipleOf', () => {

      test('multipleOf', 'by int', () => {
        const schema = json.multipleOf(2);
        return schema;
      });

      test('multipleOf', 'by number', () => {
        const schema = json.multipleOf(1.5);
        return schema;
      });

      test('multipleOf', 'by small number', () => {
        const schema = json.multipleOf(0.0001);
        return schema;
      });

    });

    describe('maximum and exclusiveMaximum', () => {

      test('maximum', 'maximum validation', () => {
        const schema = json.maximum(3.0);
        return schema;
      });

      test('maximum', 'exclusiveMaximum validation', () => {
        const schema = json.maximum(3.0).exclusiveMaximum(true);
        return schema;
      });

    });

    describe('minimum and exclusiveMinimum', () => {

      test('minimum', 'minimum validation', () => {
        const schema = json.minimum(1.1);
        return schema;
      });

      test('minimum', 'exclusiveMinimum validation', () => {
        const schema = json.minimum(1.1).exclusiveMinimum(true);
        return schema;
      });

    });

  });

  describe('array keywords', () => {

    test('items', 'a schema given for items', () => {
      const schema = json.items(json.schema().integer());
      return schema;
    });

    test('items', 'an array of schemas for items', () => {
      const schema = json.items([json.integer(), json.string()]);
      return schema;
    });

    // equivalent
    test('items', 'an array of schemas for items', () => {
      const schema = json.items(json.integer(), json.string());
      return schema;
    });

    test('additionalItems', 'additionalItems as schema', () => {
      const schema = json
          .items([json.schema()])
          .additionalItems(json.integer());

      return schema;
    });

    test('additionalItems', 'items is schema, no additionalItems', () => {
      const schema = json
          .items(json.schema())
          .additionalItems(false);

      return schema;
    });

    test('additionalItems', 'array of items with no additionalItems', () => {
      const schema = json
          .items(json.schema(), json.schema(), json.schema())
          .additionalItems(false);

      return schema;
    });

    test('additionalItems', 'additionalItems as false without items', () => {
      const schema = json.additionalItems(false);
      return schema;
    });

    test('additionalItems', 'additionalItems are allowed by default', () => {
      const schema = json.items([json.integer()]);
      return schema;
    });

    test('maxItems', 'maxItems validation', () => {
      const schema = json.maxItems(2);
      return schema;
    });

    test('minItems', 'minItems validation', () => {
      const schema = json.minItems(1);
      return schema;
    });

    test('uniqueItems', 'uniqueItems validation', () => {
      const schema = json.uniqueItems(true);
      return schema;
    });

  });

  describe('string keywords', () => {

    test('maxLength', 'maxLength validation', () => {
      const schema = json.maxLength(2);
      return schema;
    });

    test('minLength', 'minLength validation', () => {
      const schema = json.minLength(2);
      return schema;
    });


    test('pattern', 'pattern validation', () => {
      const schema = json.pattern('^a*$');
      return schema;
    });

    test('pattern', 'pattern is not anchored', () => {
      const schema = json.pattern('a+');
      return schema;
    });

  });

	describe('optional keywords', () => {

		describe('format', () => {

			test('format', 'validation of date-time strings', () => {
				const schema = json.format('date-time');
				return schema;
			});

			test('format', 'validation of URIs', () => {
				const schema = json.format('uri');
				return schema;
			});

			test('format', 'validation of e-mail addresses', () => {
				const schema = json.format('email');
				return schema;
			});

			test('format', 'validation of IP addresses', () => {
				const schema = json.format('ipv4');
				return schema;
			});

			test('format', 'validation of IPv6 addresses', () => {
				const schema = json.format('ipv6');
				return schema;
			});

			test('format', 'validation of host names', () => {
				const schema = json.format('hostname');
				return schema;
			});

		});

		describe('default', () => {

			test('default', 'invalid type for default', () => {
				const schema = json.property('foo', json.integer().default([]) );
				return schema;
			});

			test('default', 'invalid string value for default', () => {
				const schema = json.property('bar', json.string().minLength(4).default('bad'));
				return schema;
			});

		});

		describe('custom', () => {

			it('custom: adds a new keyword', () => {
				const schema = json.custom('newkeyword', 1);
				assert(isEqual(schema.json(), {
					newkeyword: 1
				}));
			})

			it('custom: handles Schema value', () => {
				const schema = json.custom('newkeyword', json.boolean());
				assert(isEqual(schema.json(), {
					newkeyword: {type: 'boolean'}
				}));
			})

			it('custom: handles Array of Schemas', () => {
				const schema = json.custom('newkeyword', [json.boolean(), json.array()]);
				assert(isEqual(schema.json(), {
					newkeyword: [{type: 'boolean'}, {type: 'array'}]
				}));
			})

		})

	});

});

describe('Tests', () => {

  const expectedDir = join(__dirname, 'expected');
  const actualDir = join(__dirname, 'actual');

  function assertMatch(filename) {
    const expected = require(join(expectedDir, filename));
    const actual = require(join(actualDir, filename));

    if (verbose && !isEqual(actual, expected) || verbose) {
      print('\nFilename: %s', filename);
      print('Expected:');
      print(expected);
      print('Actual:');
      print(actual);
    }

    assert(isEqual(actual, expected));
  }

  function rmdir(dir) {
    del.sync(dir, { force: true });
  }

  function test(schema, sample) {
    schema.save(actualDir, sample);
    assertMatch(sample);
  }

  before(() => {

    rmdir(actualDir);
    mkdirSync(actualDir);

  });

  after(() => {
    //rmdir(actualDir);
  });

  describe ('save tests', () => {

    it('should write sample schema async', done => {
      const schema = json.schema().string();
      const sample = 'sample1.json';

      schema.save(actualDir, sample, (err) => {
        if (err) return done(err)
        assertMatch(sample);
        done();
      });
    });

    it('should write sample schema sync', () => {
      const schema = json.schema().string();
      const sample = 'sample1.json';
      schema.save(actualDir, sample);
      assertMatch(sample);
    });

  });

  describe ('Simple tests', () => {

    it('should match empty schema', () => {
      const schema = json.schema();
      test(schema, 'empty.json');
    });

    it('should match schema with property', () => {
      const schema = json.property('foo');
      test(schema, 'single-property.json');
    });

    it('should also match schema with property', () => {
      const schema = json.schema().properties({ foo: {} });
      test(schema, 'single-property.json');
    });

    it('should match object schema with property', () => {
      const schema = json.object().property('foo');
      test(schema, 'explicit-object-single-property.json');
    });

    it('should match schema with additional properties allowed', () => {
      const schema = json.object().property('foo').additionalProperties(true);
      test(schema, 'additionalProperties-true.json');
    });

    it('should match schema with additional properties not allowed', () => {
      const schema = json.object().property('foo').additionalProperties(false);
      test(schema, 'additionalProperties-false.json');
    });

    it('should match schema with single required property', () => {
      const schema = json.property('foo', {}, true);
      test(schema, 'single-required-property.json');
    });

    it('should also match schema with single required property', () => {
      const schema = json.property('foo').required(true);
      test(schema, 'single-required-property.json');
    });

    it('should match schema with single required property and no others allowed', () => {
      const schema = json.property('foo').required('foo').additionalProperties(false);
      test(schema, 'single-required-property-additionalProperties-false.json');
    });

    it('should match schema with multiple properties', () => {
      const schema = json
          .property('foo', json.string(), true)
          .property('bar', json.integer());

      test(schema, 'multiple-properties.json');
    });

  });

});

