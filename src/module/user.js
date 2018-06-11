const Module = require('./module');
class User extends Module {
  build(options) {
    super.build(options);
  }
  show(context) {
    let req = context.request;
    this._doUpdateUser(req.restParams.id);
    super.show(context);
  }
  refresh(context) {
    super.refresh(context);
    let req = context.request;
    this._doUpdateUser(req.restParams.id);
  }
  _doUpdateUser(id) {
    let tmpTemplate = this._template.innerHTML.replace('{{id}}', id);
    this._template.innerHTML = tmpTemplate;
  }
}
module.exports = User;