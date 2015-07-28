import InstanceKeyword from './InstanceKeyword';
import Schema from './Schema';

export default class AnyOf extends InstanceKeyword {
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
			values.forEach(value => {
				if (typeof value != 'object' || Array.isArray(value)) {
					throw new Error('values of anyOf array must be objects');
				}
			});
			this._values = values;
		} else {
			throw new Error('values must be an array of values with at least one element');
		}
	}

	build(context) {
		context = context || {};
		if (this.values) {
			const props = [];

			this.values.forEach(elem => {
				props.push(elem instanceof Schema ? elem.build() : elem)
			});

			context['anyOf'] = props;
		}

		return context;
	}
}