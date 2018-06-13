import { app } from '@/app';
import { router } from '@/middleware/router';

describe('whole system test', () => {
  it('should be ok when run system', (done) => {
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
    done();
  });
  it('router redirect', (done) => {
    router.redirect('/404');
    done();
  });
});
