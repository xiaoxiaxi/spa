// 地址 / group /: gid / user /: uid /
//      /group / 56789 / user / 6987 --> { 'gid': 56879, 'uid': 6987 }

function rest(options) {
  console.log('%c[rest init]', 'color:blue;font-size:16px;');
  /*
  获取规则 转义
    ['/user/:id'] -> [{
          url: '/user/:id', 
          keys: ['id'], 
          matcher: /^\/user\/([^\/]+?)$/i
      }]
  */
  let matchers = options.matchers || [];
  matchers.forEach(function(it, index, list) {
    list[index] = str2matcher(it);
  });

  //rest参数预处理
  function str2matcher(url) {
    let ret = {
      url: url,
      keys: [],
      matcher: null
    };
    let reg = url.replace(/:(.+?)(?=\/|$)/g, function($1) {
      ret.keys.push($1.substr(1));
      return '([^\/]+?)';
    });
    ret.matcher = new RegExp('^' + reg + '(?=\/|$)', 'i');
    return ret;
  }
  // context: {request:new URL();}
  //获取参数 返回{ key:value }
  //path: '/xxx/xxx'
  function getParams(path) {
    // console.log('params:', path);
    let ret = {};
    /*matchers [{
        url: '/user/:id', 
        keys: ['id'], 
        matcher: /^\/user\/([^\/]+?)$/i
    }]*/
    matchers.forEach(function(it) {
      // console.log('it.matcher.lastIndex:', it.matcher.lastIndex);
      let result = it.matcher.exec(path);
      // console.log('result: ', result);
      if (!!result) {
        it.keys.forEach(function(key, index) {
          ret[key] = decodeURIComponent(result[index + 1]) || '';
        });
        return;
      }
    });
    // console.log(ret);
    return ret;
  }
  return function(context, next) {
    console.log('--------  rest middleware  --------');
    console.log('rest middleware context:', context);
    let req = context.request;
    console.log('rest hash:', req.hash || 'null');
    req.restParams = getParams(req.hash.substr(1));
    //有hash时 给context增加hash属性
    /*if (!!req.hash) {
      let hash = new URL(req.hash.substr(1), req.origin);
      hash.restParams = getParams(hash.pathname);
      context.hash = hash;
      console.log('rest, context新增hash属性：', hash);
    }*/
    console.log('--------end rest middleware--------');
    next();
  };
}

module.exports = rest;