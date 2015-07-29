import InstanceKeyword from './InstanceKeyword';
import Schema from './Schema';

export class OneOf extends InstanceKeyword {
<<<<<<< HEAD
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
=======
	constructor(values) {
		super();

		if (!Array.isArray(values)) {
			values = Array.prototype.slice.call(arguments);
		}
		this.values = values;
	}

	get values() {
		return this._values;
	}

	set values(values) {
		if (Array.isArray(values) && values.length) {
			values.forEach(value => {
				if (typeof value != 'object' || !(value instanceof Schema)) {
					throw new Error('values of oneOf array must be valid Schema instances');
				}
			});

			this._values = values;

>>>>>>> oneOf tests passing
		} else {
			throw new Error('values must be an array of values with at least one element');
		}
	}

	build(context) {
		context = context || {};
<<<<<<< HEAD
		if (this.value) {
			const props = [];

			this.value.forEach(elem => {
				props.push(elem instanceof Schema ? elem.build() : elem)
=======

		if (this.values) {
			const props = [];

			this.values.forEach(elem => {
				props.push(elem instanceof Schema ? elem.build() : elem);
>>>>>>> oneOf tests passing
			});

			context['oneOf'] = props;
		}

		return context;
	}
<<<<<<< HEAD
}


=======
}
>>>>>>> oneOf tests passing
