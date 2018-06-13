import { spa } from '@/spa';
import { rewrite } from '@/middleware/rewrite';
import { rest } from '@/middleware/rest';
import { filter } from '@/middleware/filter';
import { router } from '@/middleware/router';
import { AuthFilter } from '@/filter/auth';
import { Monitor } from '@/monitor';

describe('spa test', () => {
  describe('spa add', () => {
    it('should be ok to add middleware', (done) => {
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
      spa.add(rest(options));
      spa.add(rewrite(options));
      spa.add(filter.mw);
      filter.add([AuthFilter]);
      spa.add(router(options));
      //url监控器
      new Monitor({
        onchange: function (event) {
          let context = { request: new URL(event.newValue) };
          spa.dispatch(context);
        }
      });
      done();
    });
  });
});