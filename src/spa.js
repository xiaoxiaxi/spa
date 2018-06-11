
let mws = [];

let spa = {
  add: function(mw) {
    if (typeof mw === 'function') {
      mws.push(mw);
    }
  },
  dispatch: function(context) {
    let index = 0;
    let next = function() {
      let mw = mws[index++];
      if (mw) {
        return mw(context, next);
      }
    };
    next();
  }
};

module.exports = spa;