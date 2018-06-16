let mws = [];

export let spa = {
  add(mw) {
    if (typeof mw === 'function') {
      mws.push(mw);
    }
    return true;
  },
  dispatch(context) {
    let index = 0;
    let next = function () {
      let mw = mws[index++];
      if (mw) {
        return mw(context, next);
      }
    };
    next();
    return true;
  }
};