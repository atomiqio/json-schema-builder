import InstanceKeyword from './InstanceKeyword';
import Schema from './Schema';

export default class AllOf extends InstanceKeyword {
	constructor(value) {
		super();
		this.value = value;
	}

	get value() {
		return this._value;
	}

	set value(value) {
		if (!Array.isArray(value)) {
			value = Array.prototype.slice.call(arguments);
		}

		if (!value.length) {
			throw new Error('value must be an array with at least one element');
		}

		value.forEach(elem => {
			if (typeof elem !== 'object' || !(elem instanceof Schema)) {
				throw new Error('value in allOf array must be a Schema instance');
			}
		});

		this._value = value;
	}

	build(context) {
		context = context || {};

		if (this.value) {
			const props = [];

			this.value.forEach(elem => {
				props.push(elem instanceof Schema ? elem.build() : elem);
			});

			context['allOf'] = props;
		}

		return context;
	}
}