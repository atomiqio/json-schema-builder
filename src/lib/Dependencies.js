import ObjectKeyword from './ObjectKeyword';
import Schema from './Schema';
import { uniq } from 'lodash';

export default class Dependencies extends ObjectKeyword {
	constructor(value) {
		super();
		this.value = value;
	}

	get value() {
		return this._value;
	}

	set value(value) {
		if (typeof value == 'object' && !Array.isArray(value)) {
			for (let prop in value) {
				if (typeof prop == 'object' && !Array.isArray(prop) && !(prop instanceof Schema)) {
					throw new Error('object properties must be Schema instances');
				}

				if (Array.isArray(prop)) {
					if (!prop.length) {
						throw new Error('array must have at least one item');
					}

					if (uniq(prop).length != prop.length) {
						throw new Error('array items must must be unique');
					}

					prop.forEach(elem => {
						if (typeof elem !== 'string') {
							throw new Error('array items must strings');
						}
					});
				}
			}
		} else {
			throw new Error('value must be an object');
		}

		this._value = value;
	}

	build(context) {
		context = context || {};

		context.dependencies = this.value;
		return context;
	}
}