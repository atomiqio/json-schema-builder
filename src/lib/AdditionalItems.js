import ArrayKeyword from './ArrayKeyword';
import Schema from './Schema';

export default class AdditionalItems extends ArrayKeyword {
	constructor(value) {
		super();
		this.value = value;
	}

	get value() {
		return this._value;
	}

	set value(value) {
		if (typeof value == 'boolean' || typeof value == 'object' || value instanceof Schema) {
			this._value = value;
		} else {
			throw new Error('value must be a boolean value or a Schema instance');
		}
	}

	json(context) {
		context = context || {};

		const value = (this.value instanceof Schema)
			? this.value.json({})
			: this.value;

		context.additionalItems = value;

		return context;
	}
}