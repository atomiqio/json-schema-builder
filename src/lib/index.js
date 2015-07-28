import * as _ from 'lodash';
import assert from 'assert';
import { stringify } from '../test/helpers';

const primitiveTypes = [
  'array',
  'object',
  'boolean',
  'integer',
  'number',
  'string',
  'null'
];

// convenience functions - intended to be the main public interface

exports.schema = function() { return new Schema(...arguments) }
exports.enum = function() { return new Enum(...arguments) }
exports.patternProperties = function() { return new PatternProperties(...arguments) }

exports.type = function() { return new Type(...arguments) }
exports.string = function() { return exports.type('string') }
exports.boolean = function() { return exports.type('boolean') }
exports.object = function() { return exports.type('object') }
exports.array = function() { return exports.type('array') }
exports.integer = function() { return exports.type('integer') }
exports.number = function() { return exports.type('number') }
exports.null = function() { return exports.type('null') }


export class Builder {

  build(context) {
    throw new Error('build must be overridden');
  }
}

export class Schema extends Builder {

  constructor() {
    super();
  }

  get keywords() {
    if (!this._keywords) this._keywords = [];
    return this._keywords;
  }

  addKeyword(keyword) {
    this.keywords.push(keyword);
  }

  type(type) {
    // set
    if (type) {
      this.addKeyword(new Type(type));
      return this;
    }

    // get (return the value of the type keyword, not the keyword)
    return _.result(_.find(this.keywords, keyword => keyword instanceof Type), 'value');
  }

  boolean() { return this.type('boolean'); }
  integer() { return this.type('integer'); }
  number() { return this.type('number'); }
  string() { return this.type('string'); }
  object() { return this.type('object'); }
  array() { return this.type('array'); }
  null() { return this.type('null'); }

  set required(properties) {
    this.addKeyword(new Required(properties));
  }

  get required() {
    return _.result(_.find(this.keywords, keyword => keyword instanceof Required), 'properties');
  }

  enum(values) {
    // set
    if (values) {
      this.addKeyword(new Enum(values));
      return this;
    }

    // get
    return _.result(_.find(this.keywords, keyword => keyword instanceof Enum), 'values');
  }

  properties(value) {
    // set
    if (value) {
      this.addKeyword(new Properties(value));
      return this;
    }

    // get
    return _.result(_.find(this.keywords, keyword => keyword instanceof Properties), 'value');
  }

  property(name, value, required) {
    // set
    if (name) {
      if (typeof name == 'object') {
        required = value;
        value = undefined;
        Object.keys(name).forEach(key => {
          this.property(key, name[key], required);
        });
        return this;
      }

      const properties = _.find(this.keywords, keyword => keyword instanceof Properties);
      if (properties) {
        properties.add(name, value);
      } else {
        const prop = {};
        prop[name] = value;
        this.properties(prop);
      }

      if (required) {
        if (this.required) {
          this.required.push(name);
        } else {
          this.required = [name];
        }
      }

      return this;
    }

    // get
    const props = this.properties();
    if (props) {
      return props[name];
    }
  }

  patternProperties(value) {
    // set
    if (value) {
      this.addKeyword(new PatternProperties(value));
      return this;
    }

    // get
    return _.result(_.find(this.keywords, keyword => keyword instanceof PatternProperties), 'value');
  }

  /*
  set patternProperties(value) {
    this.addKeyword(new PatternProperties(value));
  }

  get patternProperties() {
    return _.result(_.find(this.keywords, keyword => keyword instanceof PatternProperties), 'value');
  }
  */

  patternProperty(name, value) {
    // set
    if (name) {
      if (typeof name == 'object') {
        Object.keys(name).forEach(key => {
          this.patternProperty(key, name[key]);
        });
        return this;
      }

      const properties = _.find(this.keywords, keyword => keyword instanceof PatternProperties);
      if (properties) {
        properties.add(name, value);
      } else {
        const prop = {};
        prop[name] = value;
        this.patternProperties(prop);
      }

      return this;
    }

    // get
    const props = this.patternProperties();
    if (props) {
      return props[name];
    }
  }

  set additionalProperties(value) {
    this.addKeyword(new AdditionalProperties(value));
  }

  get additionalProperties() {
    return _.result(_.find(this.keywords, keyword => keyword instanceof AdditionalProperties), 'value');
  }

  build(context) {
    context = context || {};

    this.keywords.forEach(keyword => {
      keyword.build(context);
    });

    return context;
  }
}

export class Keyword extends Builder {
}

export class InstanceKeyword extends Keyword {
}

export class Type extends InstanceKeyword {
  constructor(type) {
    super();
    this.value = type;
  }

  set value(type) {
    if (typeof type != 'string' && !Array.isArray(type)) {
      throw new Error('type must be a string or an array of strings');
    }

    if (Array.isArray(type)) {
      type.forEach(t => {
        if (!_.includes(primitiveTypes, t)) {
          throw new Error('type array elements must be a string value that specifies a valid type: ' + t);
        }
      });
    }

    this._type = type;
  }

  get value() {
    return this._type;
  }

  build(context) {
    context['type'] = this.value;
    return context;
  }
}

export class Enum extends InstanceKeyword {
  constructor(values) {
    super();

    if (!Array.isArray(values)) {
      values = Array.prototype.slice.call(arguments);
    }
    this.values = values;
  }

  get values() {
    return this._values;
  }

  set values(values) {
    if (Array.isArray(values) && values.length) {
      this._values = values;
    } else {
      throw new Error('values must be an array of values with at least one element');
    }
  }

  build(context) {
    context['enum'] = this.values;
    return context;
  }
}

export class Required extends InstanceKeyword {
  constructor(properties) {
    super();

    if (!Array.isArray(properties)) {
      properties = Array.prototype.slice.call(arguments);
    }
    this.properties = properties;
  }

  get properties() {
    return this._properties;
  }

  set properties(properties) {
    if (Array.isArray(properties) && properties.length) {
      this._properties = properties;
    } else {
      throw new Error('values must be an array of property names with at least one element');
    }
  }

  build(context) {
    context['required'] = this.properties;
    return context;
  }
}

export class KeyValuePair extends Keyword {
  constructor(key, value) {
    super();
    if (typeof key == 'object') {
      const keys = Object.keys();
      if (keys.length != 1) {
        throw new Error('KeyValuePair object must have a single key and value');
      }
      value = key[keys[0]];
      key = keys[0];
    } else if (typeof key != 'string') {
      throw new Error('keyValuePair key must be a string');
    }

    this._key = key;
    this._value = value;
  }

  get key() {
    return this._key;
  }

  get value() {
    return this._value;
  }

  get pair() {
    const o = {};
    o[this.key] = this.value;
    return o;
  }

  build(context) {
    context = context || {};
    context[this.key] = this.value;
    return context;
  }
}

export class Properties extends InstanceKeyword {
  constructor(value) {
    super();
    this.value = value;
  }

  get value() {
    return this._value;
  }

  set value(value) {
    if (typeof value == 'object') {
      this._value = value;
    } else {
      throw new Error('value must be an object');
    }
  }

  add(name, value) {
    if (typeof name == 'object') {
      Object.keys(name).forEach(key => {
        this.add(key, name[key]);
      });
      return;
    }

    if (this.value) {
      this.value[name] = value;
    } else {
      const prop = {};
      prop[name] = value;
      this.value = prop;
    }
  }

  build(context) {
    if (this.value) {
      const props = {};
      Object.keys(this.value).forEach(key => {
        let ctx = {};
        const value = this.value[key];
        props[key] = (value instanceof Builder)
            ? this.value[key].build(ctx)
            : this.value[key];
      });

      context['properties'] = props;
      return context;
    }
  }
}

export class PatternProperties extends InstanceKeyword {
  constructor(value) {
    super();
    this.value = value;
  }

  get value() {
    return this._value;
  }

  set value(value) {
    if (typeof value == 'object') {
      this._value = value;
    } else {
      throw new Error('value must be an object');
    }
  }

  add(name, value) {
    if (typeof name == 'object') {
      Object.keys(name).forEach(key => {
        this.add(key, name[key]);
      });
      return;
    }

    if (typeof name != 'string') {
      throw new Error('name must be a string and should be a valid regular expression');
    }

    if (typeof value != 'object' && value instanceof Schema) {
      throw new Error('value must be a valid Schema instance');
    }

    if (this.value) {
      this.value[name] = value;
    } else {
      const prop = {};
      prop[name] = value;
      this.value = prop;
    }
  }

  build(context) {
    if (this.value) {
      const props = {};
      Object.keys(this.value).forEach(key => {
        let ctx = {};
        const value = this.value[key];
        props[key] = (value instanceof Builder)
            ? this.value[key].build(ctx)
            : this.value[key];
      });

      context['patternProperties'] = props;
      return context;
    }
  }
}

export class AdditionalProperties extends InstanceKeyword {
  constructor(value) {
    super();
    this.value = value;
  }

  get value() {
    return this._value;
  }

  set value(value) {
    if (typeof value == 'boolean' || typeof value == 'object' || value instanceof Schema) {
      this._value = value;
    } else {
      throw new Error('value must be an boolean value or a Schema instance');
    }
  }

  build(context) {
    const value = (this.value instanceof Schema)
        ? this.value.build({})
        : this.value;

    context['additionalProperties'] = value;

    return context;
  }
}

