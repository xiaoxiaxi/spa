import { spa } from '@/spa';
import { rewrite } from '@/middleware/rewrite';
import { rest } from '@/middleware/rest';
import { filter } from '@/middleware/filter';
import { router } from '@/middleware/router';
import { AuthFilter } from '@/filter/auth';

describe('spa test', () => {
  describe('spa add method', () => {
    it('should be ok to add middleware', (done) => {
      let options = {
        matchers: [
          '/user/:id'
        ],
        rules: [{
          matcher: /\/user\/.+/i,
          target: '/user/'
        }, {
          matcher: '/405/',
          target: '/welcome/'
        }, {
          matcher: function () { return false; },
          target: '/user/'
        },
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
          '/a/d/e/g': 'g'
        }
      };
      spa.add(rest(options));
      spa.add(rewrite(options));
      spa.add(filter.mw);
      expect(filter.add([AuthFilter]).length).to.equal(1);
      expect(filter.add(AuthFilter).length).to.equal(2);
      spa.add(router(options));
      done();
    });
  });

  describe('spa add method', () => {
    it('should be ok to dispatch', (done) => {
      let context = { request: new URL(location.origin + '#/user/123') };
      expect(spa.dispatch(context)).to.equal(true);
      context = { request: new URL(location.origin + '#/404/') };
      expect(spa.dispatch(context)).to.equal(true);
      location.pathname = '/index.html';
      done();
    });
  });
});