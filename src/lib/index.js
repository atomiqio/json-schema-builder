import Schema from './Schema';
const schema = exports.schema = function () { return new Schema(...arguments) }

// generic helpers
exports.allOf = function () { return schema().allOf(...arguments) }
exports.anyOf = function () { return schema().anyOf(...arguments) }
exports.default = function () { return schema().default(...arguments) }
exports.enum = function () { return schema().enum(...arguments) }
exports.not = function () { return schema().not(...arguments) }
exports.oneOf = function () { return schema().oneOf(...arguments) }
exports.type = function () { return schema().type(...arguments) }
exports.custom = function () { return schema().custom(...arguments) }

// generic helpers - type wrappers
exports.array = function () { return schema().array() }
exports.boolean = function () { return schema().boolean() }
exports.integer = function () { return schema().integer() }
exports.null = function () { return schema().null() }
exports.number = function () { return schema().number() }
exports.object = function () { return schema().object() }
exports.string = function () { return schema().string() }


// numeric helpers
exports.exclusiveMaximum = function () { return schema().exclusiveMaximum(...arguments) }
exports.exclusiveMinimum = function () { return schema().exclusiveMinimum(...arguments) }
exports.maximum = function () { return schema().maximum(...arguments) }
exports.minimum = function () { return schema().minimum(...arguments) }
exports.multipleOf = function () { return schema().multipleOf(...arguments) }


// array helpers
exports.additionalItems = function () { return schema().additionalItems(...arguments) }
exports.items = function () { return schema().items(...arguments) }
exports.maxItems = function () { return schema().maxItems(...arguments) }
exports.minItems = function () { return schema().minItems(...arguments) }
exports.uniqueItems = function () { return schema().uniqueItems(...arguments) }

// object helpers
exports.additionalProperties = function () { return schema().additionalProperties(...arguments) }
exports.definitions = function () { return schema().definitions(...arguments) }
exports.dependencies = function () { return schema().dependencies(...arguments) }
exports.maxProperties = function () { return new schema().maxProperties(...arguments) }
exports.minProperties = function () { return new schema().minProperties(...arguments) }
exports.patternProperties = function () { return schema().patternProperties(...arguments) }
exports.properties = function () { return schema().properties(...arguments) }
exports.required = function () { return schema().required(...arguments) }
exports.$ref = function () { return schema().$ref(...arguments) }

exports.additionalProperty = function () { return schema().additionalProperty(...arguments) }
exports.patternProperty = function () { return schema().patternProperty(...arguments) }
exports.property = function () { return schema().property(...arguments) }

// string helpers
exports.maxLength = function () { return schema().maxLength(...arguments) }
exports.minLength = function () { return schema().minLength(...arguments) }
exports.pattern = function () { return schema().pattern(...arguments) }
exports.format = function () { return schema().format(...arguments) }
