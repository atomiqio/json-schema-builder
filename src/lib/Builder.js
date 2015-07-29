export default class Builder {
  build(context) {
    throw new Error('build must be overridden');
  }
}
