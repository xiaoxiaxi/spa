import { Filter } from '@/filter/filter';
import { AuthFilter } from '@/filter/auth';

describe('filter test', function () {
  it('should be ok to init Filter', function (done) {
    let chain = function () { return 1; };
    let next = function () { return 2; };
    let context = { request: new URL('https://netease.com/#/404/') };
    let fil = new Filter(context, next, chain);
    expect(fil.chain()).to.equal(1);
    expect(fil.next()).to.equal(2);
    expect(fil.doFilter()).to.equal(true);
    fil = null;
    done();
  });

  it('should be ok to init AuthFilter', function (done) {
    let chain = function () { return 'chain'; };
    let next = function () { return 'next'; };
    let context = { request: new URL('https://netease.com/#/user/1234') };
    let auth = new AuthFilter(context, next, chain);
    expect(auth.chain()).to.equal('chain');
    expect(auth.next()).to.equal('next');
    expect(auth._context).to.equal(context);
    auth.doFilter();
    auth = null;
    done();
  });
});
