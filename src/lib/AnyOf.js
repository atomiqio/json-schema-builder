import InstanceKeyword from './InstanceKeyword';
import Schema from './Schema';

export default class AnyOf extends InstanceKeyword {
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
			value.forEach(v => {
				if (typeof v != 'object' || Array.isArray(v)) {
					throw new Error('value of anyOf array must be objects');
				}
			});
			this._value = value;
		} else {
			throw new Error('value must be an array of values with at least one element');
		}
	}

	build(context) {
		context = context || {};
		if (this.value) {
			const props = [];

			this.value.forEach(elem => {
				props.push(elem instanceof Schema ? elem.build() : elem)
			});

			context['anyOf'] = props;
		}

		return context;
	}
}