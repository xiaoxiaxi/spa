class Monitor {
  constructor(option){
    option = option || {};
    let last = null;
    this.runURLCheck = ()=>{
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
  }
  start(){
    this.interval = setInterval(this.runURLCheck, 500);
  }
  stop(){
    clearInterval(this.interval);
  }
}

module.exports = Monitor;