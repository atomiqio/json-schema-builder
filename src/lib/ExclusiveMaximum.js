import NumberKeyword from './NumberKeyword';

export default class ExclusiveMaximum extends NumberKeyword {
	constructor(value) {
		super();
		this.value = value;
	}

	get value() {
		return this._value;
	}

	set value(value) {
		if (typeof value == 'boolean') {
			this._value = value;
		} else {
			throw new Error('value must be a boolean value');
		}
	}

	build(context) {
		context = context || {};

		if (!context.hasOwnProperty('maximum')) {
			throw new Error("maximum must be present with exclusiveMaximum");
		}

		context.exclusiveMaximum = this.value;
		return context;
	}
}