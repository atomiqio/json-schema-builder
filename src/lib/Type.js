import InstanceKeyword from './InstanceKeyword';
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

export default class Type extends InstanceKeyword {
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
