import Builder from './Builder';
import Schema from './Schema';
import InstanceKeyword from './InstanceKeyword';


export default class Properties extends InstanceKeyword {
  constructor(value) {
    super();
    this.value = value;
  }

  get value() {
    return this._value;
  }

  set value(value) {
    if (typeof value == 'object') {
      this._value = value;
    } else {
      throw new Error('value must be an object');
    }
  }

  add(name, value) {
    if (typeof name == 'object') {
      Object.keys(name).forEach(key => {
        this.add(key, name[key]);
      });
      return;
    }

    if (this.value) {
      this.value[name] = value;
    } else {
      const prop = {};
      prop[name] = value;
      this.value = prop;
    }
  }

  build(context) {
    if (this.value) {
      const props = {};
      Object.keys(this.value).forEach(key => {
        let ctx = {};
        const value = this.value[key];
        props[key] = (value instanceof Builder)
            ? this.value[key].build(ctx)
            : this.value[key];
      });

      context['properties'] = props;
      return context;
    }
  }
}
