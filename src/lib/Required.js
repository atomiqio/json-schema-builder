import ObjectKeyword from './ObjectKeyword';

export default class Required extends ObjectKeyword {
  constructor(value) {
    super();

    if (!Array.isArray(value)) {
      value = Array.prototype.slice.call(arguments);
    }
    this.value = value;
  }

  get value() {
    return this._value;
  }

  set value(value) {
    if (Array.isArray(value) && value.length) {
      this._value = value;
    } else {
      throw new Error('value must be an array of property names with at least one element');
    }
  }

  json(context) {
    context = context || {};
    context.required = this.value;
    return context;
  }
}

