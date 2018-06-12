import Filter from '../filter/filter';

let filters = [];

export let filter = {
  add: function(ft) {
    if (ft instanceof Array) {
      ft.forEach(function(it) {
        this.add(it);
      }.bind(this));
    } else {
      filters.push(ft);
    }
  },
  //单页中间件
  mw: function(context, next) {
    let index = 0;
    let chain = function() {
      let filter = filters[index++];
      if (filter) {
        let ft = new Filter(context, next, chain);
        ft.doFilter();
      } else {
        next();
      }
    };
    chain();
  }
};