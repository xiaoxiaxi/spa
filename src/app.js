const rest = require('./middleware/rest');
/*const history = require('./middleware/history');*/
const rewrite = require('./middleware/rewrite');
const filter = require('./middleware/filter');
const router = require('./middleware/router');
// const AuthFilter = require('./filter/auth');
const Monitor = require('./monitor');
const spa = require('./spa');

let app = {
  start: function(options) {
    //添加单页应用的中间件
    spa.add(rest(options));
    spa.add(history(options));
    spa.add(rewrite(options));
    spa.add(filter.mw);
    // filter.add([AuthFilter]);
    spa.add(router(options));
    //url监控器
    new Monitor({
      onchange: function(event) {
        let context = {
          request: new URL(event.newValue)
        };
        spa.dispatch(context);
      }
    });
  }
};
let options = {
  matchers: [
    '/user/:id'
  ],
  rules: [{
    matcher: /\/user\/.+/i,
    target: '/user/'
  }],
  routes: {
    '/404': 'notfound',
    '/welcome': 'welcome',
    '/a': 'a',
    '/b': 'b',
    '/a/c': 'c',
    '/a/d': 'd',
    '/a/d/e': 'e',
    '/a/d/e/f': 'f',
    '/a/d/e/g': 'g'
  }
};
app.start(options);
