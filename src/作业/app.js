const rest = require('./middleware/rest');
const router = require('./middleware/router');
const Monitor = require('./monitor');
const spa = require('./spa');

let app = {

  start: function(options) {
    //添加单页应用的中间件
    spa.add(rest(options));
    spa.add(router(options));
    //url监控器
    let moniter = new Monitor({
      onchange: function(event) {
        console.log('%c[url changed]', 'color:green;font-size:16px;');
        let context = {
          request: new URL(event.newValue)
        };
        spa.dispatch(context);
      }
    });
  }
}
let options = {
  matchers: [
    '/user/:id'
  ],
  routes: {
    '/404': 'notfound',
    '/welcome': 'welcome',
    '/a': 'a',
    '/b': 'b',
    '/a/c': 'c',
    '/a/d': 'd',
    '/a/d/e': 'e',
    '/a/d/e/f': 'f',
    '/a/d/e/g': 'g',
  }
};
app.start(options);