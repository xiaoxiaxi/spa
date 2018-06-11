const $ = require('jquery');
class Module {
  constructor(name, path) {
    this._component = name;
    this._path = path;
  }
  build() {
    var self = this;
    $.ajax({
      url: './modules/' + self._component,
      dataType: 'html',
      async: false,
      success: function(data) {
        var tmp = document.createElement('div');
        tmp.innerHTML = '<div>' + data + '</div>';
        self._component = tmp.childNodes[0];
      },
      error: function(err) {
        console.log(err);
      }
    });
  }
  show() {
    //do something
    if (this._component) {
      document.body.appendChild(this._component);
    }
  }
  refresh() {

  }
  hide() {
    //do something
    if (this._component) {
      this._component.parentNode.removeChild(this._component);
    }
  }
  destroy() {
    if (this._component) {
      this.hide();
      this._component = null;
    }
  }
}

module.exports = Module;