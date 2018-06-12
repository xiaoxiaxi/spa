export function rewrite(options) {
  /*rules: [{
      matcher: /\/user\/[\d]+\//i, //\/group\/[\d]+
      target: '/user/'
    }]*/
  let rules = options.rules || [];
  rules.forEach(function (rule) {
    //预处理 target
    let target = rule.target;

    if (typeof target !== 'function') {
      rule.target = function () {
        return target;
      };
    }
    //matcher -> function
    let matcher = rule.matcher;
    if (typeof matcher === 'function') {
      return;
    }

    if (typeof matcher === 'string') {
      rule.matcher = function (ctx) {
        return ctx.request.hash === '#' + matcher;
      };
      return;
    }
    if (matcher instanceof RegExp) {
      rule.matcher = function (ctx) {
        return matcher.test(ctx.request.hash);
      };
      return;
    }
  });

  return function (context, next) {
    let ret = rules.find(rule => {
      return rule.matcher(context);
    });
    if (ret) {
      let target = ret.target();
      //修改context中hash和request中的pathname
      context.request.hash = '#' + target;
    }
    next();
  };
}
