import Builder from './Builder';
import Schema from './Schema';

export default class Custom extends Builder {
  constructor(keyword, value) {
    super();
    this.keyword = keyword;
    this.value = value;
  }

  json(context) {
    context = context || {};

    if (this.value) {
      context[this.keyword] = Array.isArray(this.value) ? this.value.map(toValue) : toValue(this.value);
    }

    return context;

    function toValue(value) {
      return value instanceof Schema ? value.json() : value;
    }
  }
}
