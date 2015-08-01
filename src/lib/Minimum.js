import NumberKeyword from './NumberKeyword';

export default class Minimum extends NumberKeyword {
	constructor(value) {
		super();
		this.value = value;
	}

	set value(value) {
		if (typeof value != 'number') {
			throw new Error('value must be a number');
		}

		this._value = value;
	}

	get value() {
		return this._value;
	}

	build(context) {
		context = context || {};

		context.minimum = this.value;
		return context;
	}
}