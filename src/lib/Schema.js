import * as _ from 'lodash';
import AllOf from './AllOf';
import AnyOf from './AnyOf';
import Builder from './Builder';
import Keyword from './Keyword';
import Type from './Type';
import Required from './Required';
import Enum from './Enum';
import Maximum from './Maximum';
import Minimum from './Minimum';
import ExclusiveMaximum from './ExclusiveMaximum';
import ExclusiveMinimum from './ExclusiveMinimum';
import MultipleOf from './MultipleOf';
import Not from './Not';
import OneOf from './OneOf';
import Properties from './Properties';
import PatternProperties from './PatternProperties';
import AdditionalProperties from './AdditionalProperties';
import MaxProperties from './MaxProperties';
import MinProperties from './MinProperties';

function isDefined(value) {
  return typeof value !== 'undefined';
}

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

  getKeyword(Class) {
    return _.find(this.keywords, keyword => keyword instanceof Class);
  }

  getKeywordValue(Class, defaultValue) {
    return _.result(_.find(this.keywords, keyword => keyword instanceof Class), 'value', defaultValue);
  }

  type(type) {
    if (isDefined(type)) {
      this.addKeyword(new Type(type));
      return this;
    }

    return this.getKeywordValue(Type);
  }

  // type convenience methods
  boolean() { return this.type('boolean'); }
  integer() { return this.type('integer'); }
  number() { return this.type('number'); }
  string() { return this.type('string'); }
  object() { return this.type('object'); }
  array() { return this.type('array'); }
  null() { return this.type('null'); }

  required(properties) {
    if (isDefined(properties)) {
      this.addKeyword(new Required(properties));
      return this;
    }

    return this.getKeywordValue(Required);
  }

  enum(values) {
    if (isDefined(values)) {
      this.addKeyword(new Enum(values));
      return this;
    }

    return this.getKeywordValue(Enum);
  }

  properties(value) {
    if (isDefined(value)) {
      this.addKeyword(new Properties(value));
      return this;
    }

    return this.getKeywordValue(Properties);
  }

  property(name, value, required) {
    if (isDefined(name)) {
      if (typeof name == 'object') {
        required = value;
        value = undefined;
        Object.keys(name).forEach(key => {
          this.property(key, name[key], required);
        });
        return this;
      }

      const properties = this.getKeyword(Properties);
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

    const props = this.properties();
    if (props) {
      return props[name];
    }
  }

  patternProperties(value) {
    if (isDefined(value)) {
      this.addKeyword(new PatternProperties(value));
      return this;
    }

    return this.getKeywordValue(PatternProperties);
  }

  patternProperty(name, value) {
    if (name) {
      if (typeof name == 'object') {
        Object.keys(name).forEach(key => {
          this.patternProperty(key, name[key]);
        });
        return this;
      }

      const properties = this.getKeyword(PatternProperties);
      if (properties) {
        properties.add(name, value);
      } else {
        const prop = {};
        prop[name] = value;
        this.patternProperties(prop);
      }

      return this;
    }

    const props = this.patternProperties();
    if (props) {
      return props[name];
    }
  }

  additionalProperties(value) {
    if (isDefined(value)) {
      this.addKeyword(new AdditionalProperties(value));
      return this;
    }

    return this.getKeywordValue(AdditionalProperties);
  }

	allOf() {
		if (arguments.length) {
			this.addKeyword(new AllOf(...arguments));
			return this;
		}

		return this.getKeywordValue(AllOf);
	}

	anyOf() {
    if (arguments.length) {
			this.addKeyword(new AnyOf(...arguments));
			return this;
		}

    return this.getKeywordValue(AnyOf);
	}

	oneOf() {
    if (arguments.length) {
			this.addKeyword(new OneOf(...arguments));
			return this;
		}

		return this.getKeywordValue(OneOf);
	}

	multipleOf(value) {
		if (value) {
			this.addKeyword(new MultipleOf(value));
			return this;
		}

		return this.getKeywordValue(MultipleOf);
	}

	maximum(value) {
		if (value) {
			this.addKeyword(new Maximum(value));
			return this;
		}

		return this.getKeywordValue(Maximum);
	}

	exclusiveMaximum(value) {
		if (isDefined(value)) {
			this.addKeyword(new ExclusiveMaximum(value));
			return this;
		}

		return this.getKeywordValue(ExclusiveMaximum);
	}

	minimum(value) {
		if (value) {
			this.addKeyword(new Minimum(value));
			return this;
		}

		return this.getKeywordValue(Minimum);
	}

	exclusiveMinimum(value) {
		if (isDefined(value)) {
			this.addKeyword(new ExclusiveMinimum(value));
			return this;
		}

		return this.getKeywordValue(ExclusiveMinimum);
	}

	not(value) {
		// set
		if (value) {
			this.addKeyword(new Not(value));
			return this;
		}

		// get
		return this.getKeywordValue(Not);
	}

  maxProperties(value) {
    if (isDefined(value)) {
      this.addKeyword(new MaxProperties(value));
      return this;
    }

    return this.getKeywordValue(MaxProperties);
  }

  minProperties(value) {
    if (isDefined(value)) {
      this.addKeyword(new MinProperties(value));
      return this;
    }

    return this.getKeywordValue(MaxProperties);
  }

  build(context) {
    context = context || {};

    this.keywords.forEach(keyword => {
      keyword.build(context);
    });

    return context;
  }
}

