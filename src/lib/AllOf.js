import Keyword from './Keyword';
import Schema from './Schema';

export default class AllOf extends Keyword {
	constructor(value) {
		super();
		this.value = arguments.length > 1 ? Array.prototype.slice.call(arguments) : value;
	}

	get value() {
		return this._value;
	}

	set value(value) {
		if (!Array.isArray(value) || !value.length) {
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

			context.allOf = props;
		}

		return context;
	}
}