import * as _ from 'lodash';
import Builder from './Builder';
import Keyword from './Keyword';
import Type from './Type';
import Required from './Required';
import Enum from './Enum';
import Properties from './Properties';
import PatternProperties from './PatternProperties';
import AdditionalProperties from './AdditionalProperties';

export default class Schema extends Builder {

  constructor() {
    super();
  }

  get keywords() {
    if (!this._keywords) this._keywords = [];
    return this._keywords;
  }

  addKeyword(keyword) {
    this.keywords.push(keyword);
  }

  type(type) {
    // set
    if (type) {
      this.addKeyword(new Type(type));
      return this;
    }

    // get (return the value of the type keyword, not the keyword)
    return _.result(_.find(this.keywords, keyword => keyword instanceof Type), 'value');
  }

  boolean() { return this.type('boolean'); }
  integer() { return this.type('integer'); }
  number() { return this.type('number'); }
  string() { return this.type('string'); }
  object() { return this.type('object'); }
  array() { return this.type('array'); }
  null() { return this.type('null'); }

  required(properties) {
    // set
    if (properties) {
      this.addKeyword(new Required(properties));
      return this;
    }

    // get
    return _.result(_.find(this.keywords, keyword => keyword instanceof Required), 'properties');
  }

  enum(values) {
    // set
    if (values) {
      this.addKeyword(new Enum(values));
      return this;
    }

    // get
    return _.result(_.find(this.keywords, keyword => keyword instanceof Enum), 'values');
  }

  properties(value) {
    // set
    if (value) {
      this.addKeyword(new Properties(value));
      return this;
    }

    // get
    return _.result(_.find(this.keywords, keyword => keyword instanceof Properties), 'value');
  }

  property(name, value, required) {
    // set
    if (name) {
      if (typeof name == 'object') {
        required = value;
        value = undefined;
        Object.keys(name).forEach(key => {
          this.property(key, name[key], required);
        });
        return this;
      }

      const properties = _.find(this.keywords, keyword => keyword instanceof Properties);
      if (properties) {
        properties.add(name, value);
      } else {
        const prop = {};
        prop[name] = value;
        this.properties(prop);
      }

      if (required) {
        if (this.required()) {
          this.required().push(name);
        } else {
          this.required([name]);
        }
      }

      return this;
    }

    // get
    const props = this.properties();
    if (props) {
      return props[name];
    }
  }

  patternProperties(value) {
    // set
    if (value) {
      this.addKeyword(new PatternProperties(value));
      return this;
    }

    // get
    return _.result(_.find(this.keywords, keyword => keyword instanceof PatternProperties), 'value');
  }

  patternProperty(name, value) {
    // set
    if (name) {
      if (typeof name == 'object') {
        Object.keys(name).forEach(key => {
          this.patternProperty(key, name[key]);
        });
        return this;
      }

      const properties = _.find(this.keywords, keyword => keyword instanceof PatternProperties);
      if (properties) {
        properties.add(name, value);
      } else {
        const prop = {};
        prop[name] = value;
        this.patternProperties(prop);
      }

      return this;
    }

    // get
    const props = this.patternProperties();
    if (props) {
      return props[name];
    }
  }

  additionalProperties(value) {
    // set
    if (typeof value != 'undefined') {
      this.addKeyword(new AdditionalProperties(value));
      return this;
    }

    // get
    return _.result(_.find(this.keywords, keyword => keyword instanceof AdditionalProperties), 'value');
  }

  build(context) {
    context = context || {};

    this.keywords.forEach(keyword => {
      keyword.build(context);
    });

    return context;
  }
}

