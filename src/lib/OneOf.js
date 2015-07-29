import InstanceKeyword from './InstanceKeyword';
import Schema from './Schema';

export class OneOf extends InstanceKeyword {
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
			value.forEach(elem => {
				if (typeof elem != 'object' || Array.isArray(elem)) {
					throw new Error('values of oneOf array must be objects');
				}
			});
			this._value = value;
		} else {
			throw new Error('values must be an array of values with at least one element');
		}
	}

	build(context) {
		context = context || {};
		if (this.value) {
			const props = [];

			this.value.forEach(elem => {
				props.push(elem instanceof Schema ? elem.build() : elem)
			});

			context['oneOf'] = props;
		}

		return context;
	}
}


