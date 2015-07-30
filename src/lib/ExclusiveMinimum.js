import NumberKeyword from './NumberKeyword';

export default class ExclusiveMinimum extends NumberKeyword {
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
			throw new Error('value must be an boolean value');
		}
	}

	build(context) {
		context = context || {};

		if (!context.hasOwnProperty('minimum')) {
			throw new Error("minimum must be present with exclusiveMinimum");
		}

		context['exclusiveMinimum'] = this.value;
		return context;
	}
}