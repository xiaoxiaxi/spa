import { rewrite } from './middleware/rewrite';
import { rest } from './middleware/rest';
import { filter } from './middleware/filter';
import { router } from './middleware/router';
import { AuthFilter } from './filter/auth';
import { Monitor } from './monitor';
import { spa } from './spa';

let app = {
  start: function (options) {
    //添加单页应用的中间件
    spa.add(rest(options));
    spa.add(rewrite(options));
    spa.add(filter.mw);
    filter.add(AuthFilter);
    spa.add(router(options));

    //url监控器
    let mon = new Monitor({
      onchange: (event) => {
        let context = {
          request: new URL(event.newValue)
        };
        spa.dispatch(context);
      }
    });
    mon.start();
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
