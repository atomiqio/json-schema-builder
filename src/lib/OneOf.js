import Keyword from './Keyword';
import Schema from './Schema';

export default class OneOf extends Keyword {
  constructor(value) {
    super();
    this.value = arguments.length > 1 ? Array.prototype.slice.call(arguments) : value;
  }

  get value() {
    return this._value;
  }

  set value(value) {
    if (!Array.isArray(value) || !value.length) {
      throw new Error('value must be an array of values with at least one element');
    }

    value.forEach(elem => {
      if (typeof elem != 'object' || !(elem instanceof Schema)) {
        throw new Error('array values must be valid Schema instances');
      }
    });

    this._value = value;
  }

  json(context) {
    context = context || {};

    if (this.value) {
      const props = [];

      this.value.forEach(elem => {
        props.push(elem instanceof Schema ? elem.json() : elem);
      });

      context.oneOf = props;
    }

    return context;
  }

}
