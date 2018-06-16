import { UMI } from '../umi/umi';

export function router(options) {
  let routes = options.routes || {};
  let current = null;
  UMI.parse(routes);

  return function (context, next) {
    let req = context.request;
    let path = req.hash.substr(1);
    console.log(current);
    if (!current) {
      current = path;
      UMI.show(path);
    }
    if (current !== path) {
      UMI.jump(current, path);
      current = path;
    }
    next();
  };
}

router.redirect = function (hash) {
  location.hash = '#' + hash;
};
