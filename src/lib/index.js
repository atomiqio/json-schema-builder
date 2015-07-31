import AdditionalItems from './AdditionalItems';
import AdditionalProperties from './AdditionalProperties';
import AllOf from './AllOf';
import AnyOf from './AnyOf';
import Builder from './Builder';
import Definitions from './Definitions';
import Dependencies from './Dependencies';
import Enum from './Enum';
import ExclusiveMaximum from './ExclusiveMaximum';
import ExclusiveMinimum from './ExclusiveMinimum';
import Items from './Items';
import Keyword from './Keyword';
import Maximum from './Maximum';
import MaxItems from './MaxItems';
import MaxLength from './MaxLength';
import MaxProperties from './MaxProperties';
import Minimum from './Minimum';
import MinItems from './MinItems';
import MinLength from './MinLength';
import MinProperties from './MinProperties';
import MultipleOf from './MultipleOf';
import Not from './Not';
import OneOf from './OneOf';
import Pattern from './Pattern';
import PatternProperties from './PatternProperties';
import Properties from './Properties';
import RefKeyword from './RefKeyword';
import Required from './Required';
import Schema from './Schema';
import Type from './Type';
import UniqueItems from './UniqueItems';

exports.schema = function () { return new Schema(...arguments) }

// generic helpers
exports.allOf = function () { return new AllOf(...arguments) }
exports.anyOf = function () { return new AnyOf(...arguments) }
exports.enum = function () { return new Enum(...arguments) }
exports.not = function () { return new Not(...arguments) }
exports.oneOf = function () { return new OneOf(...arguments) }
exports.type = function () { return new Type(...arguments) }
// (type wrappers)
exports.array = function () { return exports.type('array') }
exports.boolean = function () { return exports.type('boolean') }
exports.integer = function () { return exports.type('integer') }
exports.null = function () { return exports.type('null') }
exports.number = function () { return exports.type('number') }
exports.object = function () { return exports.type('object') }
exports.string = function () { return exports.type('string') }


// numeric helpers
exports.exclusiveMaximum = function() { return new ExclusiveMaximum(...arguments) }
exports.exclusiveMinimum = function() { return new ExclusiveMinimum(...arguments) }
exports.maximum = function() { return new Maximum(...arguments) }
exports.minimum = function() { return new Minimum(...arguments) }
exports.multipleOf = function() { return new MultipleOf(...arguments) }


// array helpers
exports.additionalItems = function() { return new AdditionalItems(...arguments) }
exports.items = function() { return new Items(...arguments) }
exports.maxItems = function() { return new MaxItems(...arguments) }
exports.minItems = function() { return new MinItems(...arguments) }
exports.uniqueItems = function() { return new UniqueItems(...arguments) }

// object helpers
exports.additionalProperties = function() { return new AdditionalProperties(...arguments) }
exports.definitions = function() { return new Definitions(...arguments) }
exports.dependencies = function() { return new Dependencies(...arguments) }
exports.maxProperties = function() { return new MaxProperties(...arguments) }
exports.minProperties = function() { return new MinProperties(...arguments) }
exports.patternProperties = function() { return new PatternProperties(...arguments) }
exports.properties = function() { return new Properties(...arguments) }
exports.required = function() { return new Required(...arguments) }

// string helpers
exports.maxLength = function() { return new MaxLength(...arguments) }
exports.minLength = function() { return new MinLength(...arguments) }
exports.pattern = function() { return new Pattern(...arguments) }

