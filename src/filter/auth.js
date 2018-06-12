import Filter from './filter';
import router from '../middleware/router';

export class AuthFilter extends Filter {
  doFilter() {
    // 获取要去的模块
    let req = this._context.request;
    let hash = req.hash;
    //获取用户
    let user = req.restParams.id || '';
    //如果是要去一个模块并且该模块是 / user /
    if (hash && hash === '#/user/') {
      //假设这个获取服务器session的方法↓
      let getSession = (url, id) => {
        let result = {};
        if (url) {
          result = { user: id };
        }
        return result;
      };
      //获得session
      let session = getSession('/getsession', '小明');
      if (user && user !== session.user) {
        router.redirect('#/login/');
        return;
      }
    }
    super.chain();
  }
}
