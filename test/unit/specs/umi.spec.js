import { UMI } from '@/umi/umi';

describe('UMI test', () => {
  describe('UMI parse & findNode & findParent', () => {
    it('{/:a}', (done) => {
      let pathRoute = { '/': 'a' };
      UMI.parse(pathRoute);
      expect(UMI.component).to.equal('a');
      expect(UMI.findNode('/')).to.equal(undefined);
      done();
    });
    it('{/b:b}', (done) => {
      let pathRoute = { '/b': 'b' };
      UMI.parse(pathRoute);
      expect(UMI.children.b).to.equal(UMI.findNode('/b'));
      done();
    });
    it('{/b/c: c, /d: d, /d/e: e }', (done) => {
      let pathRoute = { '/b/c': 'c', '/d': 'd', '/d/e': 'e' };
      UMI.parse(pathRoute);
      expect(UMI.children.b.children.c).to.equal(UMI.findNode('/b/c'));
      expect(UMI.children.d).to.equal(UMI.findNode('/d'));
      expect(UMI.children.d.children.e).to.equal(UMI.findNode('/d/e'));
      done();
    });
    it('findNode & finParent', (done) => {
      expect(UMI.findNode('/b')).to.equal(UMI.findParent('/b/c'));
      expect(UMI.findNode('/d')).to.equal(UMI.findParent('/d/e'));
      expect(UMI.findNode('/')).to.equal(UMI.findParent('/d'));
      done();
    });
    it('build', (done) => {
      UMI.build();
      UMI.build('/d/e');
      done();
    });
    it('show', (done) => {
      UMI.show();
      UMI.show('/d');
      UMI.show('/d');
      UMI.show('/d/e');
      done();
    });
    it('jump', (done) => {
      UMI.jump('/d', '/d/e');
      UMI.jump('/d/e', '/d');
      done();
    });
    it('pathParse', (done) => {
      expect(UMI.pathParse('/d') + '').to.equal(['d'] + '');
      expect(UMI.pathParse('/d/e') + '').to.equal(['d','e'] + '');
      expect(UMI.pathParse('/') + '').to.equal([] + '');
      expect(UMI.pathParse() + '').to.equal([] + '');
      done();
    });
  });
});