import InstanceKeyword from './InstanceKeyword';

export default class Enum extends InstanceKeyword {
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
    context = context || {};
    context['enum'] = this.values;
    return context;
  }
}

