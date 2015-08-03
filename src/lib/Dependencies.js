import ObjectKeyword from './ObjectKeyword';
import Builder from './Builder';
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
				if ((typeof prop == 'object' && !(prop instanceof Schema)) && !Array.isArray(prop)) {
					throw new Error('value property must be array or Schema instance');
				}
				else if (Array.isArray(prop)) {
					if (!prop.length) {
						throw new Error('array must have at least one item');
					}

					if (uniq(prop).length != prop.length) {
						throw new Error('array items must be unique');
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

	json(context) {
		context = context || {};

		if (this.value) {
			const props = {};
			Object.keys(this.value).forEach(key => {
				let ctx = {};
				const value = this.value[key];
				props[key] = (value instanceof Builder)
					? this.value[key].json(ctx)
					: this.value[key];
			});

			context.dependencies = props;
		}

		return context;
	}
}