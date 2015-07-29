import InstanceKeyword from './InstanceKeyword';

export default class Enum extends InstanceKeyword {
  constructor(values) {
    super();
    this.values = values;
  }

  get values() {
    return this._values;
  }

  set values(values) {
    if (!Array.isArray(values)) {
      values = Array.prototype.slice.call(arguments);
    }

    if (values.length) {
      this._values = values;
    } else {
      throw new Error('must have at least one value');
    }
  }

  build(context) {
    context = context || {};
    context['enum'] = this.values;
    return context;
  }
}

