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
    it('findNode & finParent', (done)=>{
      expect(UMI.findNode('/b')).to.equal(UMI.findParent('/b/c'));
      expect(UMI.findNode('/d')).to.equal(UMI.findParent('/d/e'));
      expect(UMI.findNode('/')).to.equal(UMI.findParent('/d'));
      done();
    });
    it('show', (done)=>{
      // UMI.build('/d');
      // UMI.show('/d');
      done();
    });
  });
});