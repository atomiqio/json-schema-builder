import InstanceKeyword from './InstanceKeyword';

export default class Required extends InstanceKeyword {
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
    context = context || {};
    context['required'] = this.properties;
    return context;
  }
}

