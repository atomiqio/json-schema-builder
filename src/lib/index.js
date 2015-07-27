import * as _ from 'lodash';
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

  set type(type) {
    this.addKeyword(new Type(type));
  }

  get type() {
    return _.result(_.find(this.keywords, keyword => keyword instanceof Type), 'value');
  }

  set required(properties) {
    this.addKeyword(new Required(properties));
  }

  get required() {
    return _.result(_.find(this.keywords, keyword => keyword instanceof Required), 'properties');
  }

  set enum(values) {
    this.addKeyword(new Enum(values));
  }

  get enum() {
    return _.result(_.find(this.keywords, keyword => keyword instanceof Enum), 'values');
  }

  set allOf(values) {
    this.addKeyword(new AllOf(values));
  }

  get allOf() {
    return _.result(_.find(this.keywords, keyword => keyword instanceof AllOf), 'values');
  }

  set properties(value) {
    this.addKeyword(new Properties(value));
  }

  get properties() {
    return _.result(_.find(this.keywords, keyword => keyword instanceof Properties), 'value');
  }

  addProperty(name, value, required) {
    if (typeof name == 'object') {
      required = value;
      value = undefined;
      Object.keys(name).forEach(key => {
        this.addProperty(key, name[key], required);
      });
      return;
    }

    const properties = _.find(this.keywords, keyword => keyword instanceof Properties);
    if (properties) {
      properties.add(name, value);
    } else {
      const prop = {};
      prop[name] = value;
      this.properties = prop;
    }

    if (required) {
      if (this.required) {
        this.required.push(name);
      } else {
        this.required = [name];
      }
    }
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

export class AllOf extends InstanceKeyword {
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
      values.forEach(value => {
        if (typeof value !== 'object') {
          throw new Error('values in allOf array must be objects');
        }
      });

      this._values = values;
    } else {
      throw new Error('values must be an array of values with at least one element');
    }
  }

  build(context) {
    context['allOf'] = this.values;
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
