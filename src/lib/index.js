export class Builder {

  build(context) {
    throw new Error('build must be overridden');
  }
}

export class Schema extends Builder {

  constructor() {
    super();
  }

  get keywords() {
    if (!this._keywords) this._keywords = [];
    return this._keywords;
  }

  addKeyword(keyword) {
    this.keywords.push(keyword);
  }

  set type(type) {
    this.addKeyword(new Type(type));
  }

  build(context) {
    context = context || {};

    this.keywords.forEach(keyword => {
      keyword.build(context);
    });

    return context;
  }
}

export class Keyword extends Builder {
}

export class InstanceKeyword extends Keyword {
}

export class Type extends InstanceKeyword {
  constructor(type) {
    super();
    this.type = type;
  }

  set type(type) {
    if (typeof type != 'string' && !Array.isArray(type)) {
      throw new Error('type must be a string or an array of strings');
    }
    this._type = type;
  }

  get type() {
    return this._type;
  }

  build(context) {
    context['type'] = this.type;
    return context;
  }
}

