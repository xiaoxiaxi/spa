function Monitor(option) {
  option = option || {};
  let last = null;
  let runURLCheck = function() {
    let url = location.href;
    if (url !== last) {
      let event = {
        oldValue: last,
        newValue: url
      };
      last = url;
      if (typeof option.onchange === 'function') {
        option.onchange(event);
      }
    }
  };
  setInterval(runURLCheck, 500);
}

module.exports = Monitor;