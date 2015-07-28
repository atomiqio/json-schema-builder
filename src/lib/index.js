import * as _ from 'lodash';
import assert from 'assert';
import AnyOf from './AnyOf';
import Builder from './Builder';
import Schema from './Schema';
import Keyword from './Keyword';
import Type from './Type';
import Required from './Required';
import Enum from './Enum';
import Properties from './Properties';
import PatternProperties from './PatternProperties';
import AdditionalProperties from './AdditionalProperties';

exports.schema = function () { return new Schema(...arguments) }
exports.enum = function () { return new Enum(...arguments) }
exports.patternProperties = function () { return new PatternProperties(...arguments) }

exports.type = function () { return new Type(...arguments) }
exports.string = function () { return exports.type('string') }
exports.boolean = function () { return exports.type('boolean') }
exports.object = function () { return exports.type('object') }
exports.array = function () { return exports.type('array') }
exports.integer = function () { return exports.type('integer') }
exports.number = function () { return exports.type('number') }
exports.null = function () { return exports.type('null') }

