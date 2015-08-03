import Keyword from './Keyword';
import * as _ from 'lodash';

const primitiveTypes = [
  'array',
  'object',
  'boolean',
  'integer',
  'number',
  'string',
  'null'
];

export default class Type extends Keyword {
  constructor(value) {
    super();
    this.value = value;
  }

  set value(value) {
    if (typeof value != 'string' && !Array.isArray(value)) {
      throw new Error('value must be a string or an array of strings');
    }

    if (Array.isArray(value)) {
      value.forEach(t => {
        if (!_.includes(primitiveTypes, t)) {
          throw new Error('value array elements must be a string value that specifies a valid value: ' + t);
        }
      });
    }

    this._value = value;
  }

  get value() {
    return this._value;
  }

  json(context) {
    context = context || {};
    context.type = this.value;
    return context;
  }
}
