function rewrite(options) {
  console.log('%c[rewrite init]', 'color:blue;font-size:16px;');
  /*
    rules: [{
      matcher: /\/user\/[\d]+\//i, //\/group\/[\d]+
      target: '/user/'
    }]
  */
  let rules = options.rules || [];
  rules.forEach(function(rule) {
    //预处理 target
    let target = rule.target;

    if (typeof target !== 'function') {
      rule.target = function() {
        return target;
      };
    }
    //matcher -> function
    let matcher = rule.matcher;
    if (typeof matcher === 'function') {
      return;
    }

    if (typeof matcher === 'string') {
      rule.matcher = function(ctx) {
        return ctx.request.hash === '#' + matcher;
      };
      return;
    }
    if (matcher instanceof RegExp) {
      rule.matcher = function(ctx) {
        return matcher.test(ctx.request.hash);
      };
      return;
    }
  });

  return function(context, next) {
    console.log('-------- rewirte middleware  --------');
    console.log('context:', context);
    let ret = rules.find(function(rule) {
      return rule.matcher(context);
    });
    console.log('找到规则：', ret);
    if (ret) {
      let target = ret.target();
      console.log('target:', target);
      //修改context中hash和request中的pathname
      context.request.hash = '#' + target;
    }
    console.log('--------end rewirte middleware--------');
    next();
  };
}

module.exports = rewrite;