import InstanceKeyword from './InstanceKeyword';

export default class Required extends InstanceKeyword {
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

  build(context) {
    context = context || {};
    context['required'] = this.value;
    return context;
  }
}

