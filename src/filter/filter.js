export class Filter {
  constructor(context, next, chain) {
    this._context = context;
    this._chain = chain;
    this._next = next;
  }
  chain() {
    if (this._chain) {
      return this._chain();
    }
  }
  next() {
    if (this._next) {
      return this._next();
    }
  }
  diFilter() {
    //Overwrite by subclasses
    return true;
  }
}
