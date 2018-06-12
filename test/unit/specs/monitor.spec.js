import Moniter from '@/monitor';

describe('monitor test', function (done) {
  describe('#star', function () {
    it('should be ok to start monitor', function () {
      let value = 'test new value';

      let mon = new Moniter({
        onchange: function (event) {
          expect(event.oldValue).to.equal('');
          expect(event.newValue).to.equal(value);
          done();
        }
      });
      mon.start();
    });
  });
});
