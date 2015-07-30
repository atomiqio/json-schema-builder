import ArrayKeyword from './ArrayKeyword';
import Schema from './Schema';

export default class Items extends ArrayKeyword {
	constructor(value) {
		super();
		this.value = value;
	}

	get value() {
		return this._value;
	}

	set value(value) {
		if (typeof value == 'object' && value instanceof Schema) {
			this._value = value;
		} else if (Array.isArray(value)) {
			value.forEach(v => {
				if (typeof v !== 'object' && !(v instanceof Schema)) {
					throw new Error('array values must be Schema instances');
				}
			});
			this._value = value;
		} else {
			throw new Error('value must be an array or a Schema instance');
	}
	}

	build(context) {
		context = context || {};

		if (this.value) {
			let props;

			if (this.value instanceof Schema) {
				props = this.value.build();
			} else {
				props = [];

				this.value.forEach(elem => {
					props.push(elem instanceof Schema ? elem.build() : elem);
				});
			}

			context['items'] = props;
		}

		return context;
	}
}