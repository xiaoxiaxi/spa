const Filter = require('./filter');
const router = require('../middleware/router');
class AuthFilter extends Filter {
  doFilter() {
    console.log('登录状态filter');
    // 获取要去的模块
    let req = this._context.request;
    let hash = req.hash;
    //获取用户
    let user = req.restParams.id || '';
    //如果是要去一个模块并且该模块是 / user /
    if (hash && hash === '#/user/') {

      console.log('没有axios，使用模拟方法');
      //假设这个获取服务器session的方法↓
      let getSession = function (url, id) {
        if (url) {
          return { user: id };
        }
        return {};
      };
      //获得session
      let session = getSession('/getsession', '小明');
      if (user && user === session.user) {
        super.chain();
      } else {
        console.log('该用户未登录');
        router.redirect('#/login/');
        return;
      }
    } else {
      super.chain();
    }
  }
}

module.exports = AuthFilter;