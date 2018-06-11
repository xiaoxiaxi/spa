const Filter = require('../filter/filter');

let filters = [];

let filter = {
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
    console.log('--------  filter middleware  --------');
    let index = 0;
    let chain = function() {
      let filter = filters[index++];
      if (filter) {
        let ft = new Filter(context, next, chain);
        ft.doFilter();
      } else {
        console.log('--------end filter middleware--------');
        next();
      }
    };
    chain();
  }
};
module.exports = filter;