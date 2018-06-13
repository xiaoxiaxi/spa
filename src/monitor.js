export class Monitor {
  constructor(option = {}) {
    let last = null;
    this.runURLCheck = () => {
      let url = location.href;
      if (url !== last) {
        let event = {
          oldValue: last,
          newValue: url
        };
        last = url;
        if (typeof option.onchange === 'function') {
          option.onchange(event);
          return true;
        }
        return false;
      }
    };
  }
  start() {
    this.interval = setInterval(this.runURLCheck, 500);
    return true;
  }
  stop() {
    clearInterval(this.interval);
    return true;
  }
}
