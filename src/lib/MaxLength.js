import StringKeyword from './StringKeyword';

export default class MaxLength extends StringKeyword {
	constructor(value) {
		super();
		this.value = value;
	}

	get value() {
		return this._value;
	}

	set value(value) {
		if (value >= 0 && Number.isInteger(value)) {
			this._value = value;
		} else {
			throw new Error('value must be an integer and greater than or equal to zero');
		}
	}

	build(context) {
		context = context || {};

		context.maxLength = this.value;
		return context;
	}
}