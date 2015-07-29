import * as _ from 'lodash';
import assert from 'assert';
import Builder from './Builder';
import Schema from './Schema';
import Keyword from './Keyword';


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

