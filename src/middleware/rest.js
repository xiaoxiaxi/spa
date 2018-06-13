export function rest(options) {
  /*获取规则 转义*/
  let matchers = options.matchers || [];
  matchers.forEach((it, index, list) => {
    list[index] = str2matcher(it);
  });

  //rest参数预处理
  function str2matcher(url) {
    let ret = {
      url: url,
      keys: [],
      matcher: null
    };
    let reg = url.replace(/:(.+?)(?=\/|$)/g, function ($1) {
      ret.keys.push($1.substr(1));
      return '([^/]+?)';
    });
    ret.matcher = new RegExp('^' + reg + '(?=/|$)', 'i');
    return ret;
  }

  //获取参数 返回{ key:value }
  function getParams(path) {
    let ret = {};
    matchers.forEach(function (it) {
      let result = it.matcher.exec(path);
      if (result) {
        it.keys.forEach((key, index) => {
          ret[key] = decodeURIComponent(result[index + 1]) || '';
        });
        return;
      }
    });
    return ret;
  }
  return function (context, next) {
    let req = context.request;
    req.restParams = getParams(req.hash.substr(1));
    next();
  };
}