import { Monitor } from '@/monitor';

describe('monitor test', function () {
  describe('#star', function () {
    it('should be ok to start monitor', function (done) {
      let mon = new Monitor({
        onchange: function (event) {
          expect(event.oldValue).to.equal(null);
          expect(event.newValue).to.equal(location.href);
        }
      });
      expect(mon.runURLCheck()).to.equal(true);
      expect(mon.start()).to.equal(true);
      expect(mon.stop()).to.equal(true);
      mon = null;
      done();
    });
    it('should not be ok to start monitor', function (done) {
      let monitor = new Monitor({ onchange:'' });
      expect(monitor.runURLCheck()).to.equal(false);
      monitor = null;
      done();
    });
  });
});
