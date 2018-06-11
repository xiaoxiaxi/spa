const $ = require('jquery');

function router(options) {
  console.log('%c[router init]', 'color:blue;font-size:16px;');
  let routes = options.routes || {};
  let current = null;
  let UMI = {
    baseUrl: '/modules/',
    fileType: 'html',
    children: {},
    status: 'shown', //'built', 'shown', 'unloaded'
    /*
      将路由表解析为UMI树
    */
    parse(routes) {
      Object.keys(routes).forEach(function(route) {
        let component = routes[route];
        let parts = route.split('/');
        let grand = this;
        let parent = this;
        if (parts[0] === '') {
          parts.splice(0, 1);
        }
        if (parts[parts.length - 1] === '') {
          parts.splice(parts.length - 1, 1);
        }
        for (var i = 0, len = parts.length; i < len; i++) {
          if (typeof parent.children[parts[i]] === 'undefined') {
            parent.children[parts[i]] = { children: {}, component: null, status: 'unloaded' };
          }
          grand = parent.children;
          parent = parent.children[parts[i]];
        }
        if (component && i) {
          grand[parts[--i]].component = component;
        } else {
          this.component = component;
        }
      }.bind(this));
    },
    /*
      某块构建方法
    */
    build(path) {
      if (typeof path !== 'string') {
        return;
      }
      let node = this.findNode(path);
      console.log('build path:', path, '\nbuild node:', node);

      if (node.status !== 'unloaded' || !node.component) {
        return;
      }
      //加载文件
      $.ajax({
        url: this.baseUrl + node.component + '.' + this.fileType,
        dataType: 'html',
        async: false,
        success: function(data) {
          node.template = document.createElement('div');
          node.template.innerHTML = data;
          node.template.className += ' ' + node.component;
          node.script = node.template.querySelector('script');
          if (node.script) {
            node.template.removeChild(node.script);
            node.script = node.script.innerHTML;
          }
          console.log('build ' + node.component + ' success');
          //状态管理
          node.status = 'built';
        }
      });
    },
    /*
      模块显示方法
    */
    show(path) {
      console.log('SHOW ' + path + ' NODE');
      if (typeof path !== 'string' || !path) {
        return;
      }
      let node = this.findNode(path);
      let parent = this.findParent(path);
      console.log('show node:', node, '\nshow parent:', parent, '\nshow path:', path);
      switch (node.status) {
      case 'shown':
        console.log('show status: shown');
        this.refresh(path);
        if (parent) {
          this.show(this.parentPath(path));
        }
        break;
      case 'built':{
        console.log('show status: built');
        let tmpEl;
        //父节点为根节点
        if (!parent) {
          tmpEl = document.querySelector('.route-content');
        } else {
          if (parent.status !== 'shown') {
            this.show(this.parentPath(path));
          }
          let parentNode = document.querySelector('.' + parent.component);
          tmpEl = parentNode.querySelector('.route-content');
        }
        if (tmpEl) {
          tmpEl.appendChild(node.template);
        }
        //定义一个scriptLoaded属性，防止js的重复载入
        if (node.script && !node.scriptLoaded) {
          this.loadScriptString(node.script);
          node.scriptLoaded = true;
        }
        node.status = 'shown';
        break;
      }
      case 'unloaded':
        console.log('show status: unloaded');
        this.build(path);
        this.show(path);
        break;
      default:
        console.log(`好像没有${node.status}这个状态呦~`);
        break;
      }
      console.log('SHOW ' + path + ' END');
    },
    /*
      模块刷新方法
    */
    refresh(path) {
      console.log(`REFRESH ${path} NODE`);
      if (typeof path !== 'string') {
        return;
      }
      let node = this.findNode(path);
      if (node.status === 'shown') {
        console.log('刷新啦~');
      }
      console.log(`REFRESH ${path} END`);
    },
    /*
      模块隐藏方法
      params: fromPath , toPath（可选）
      如果只有一个formPath, 隐藏fromPath对应模块
      两个参数都有，隐藏父级模块，直到toPath，但只能隐藏父级
    */
    hide(fromPath, toPath) {
      console.log(`HIDE ${fromPath} NODE TO ${toPath}`);
      if (typeof fromPath !== 'string') {
        return;
      }
      let node = this.findNode(fromPath);
      if (node.status === 'shown') {
        let temp = document.querySelector('.' + node.component);
        console.log('hide: ', temp);
        if (temp) {
          temp.parentNode.removeChild(temp);
          node.status = 'built';
        }
      }
      let parentPath = this.parentPath(fromPath);
      if (parentPath !== '/' && toPath) {
        console.log('hide parentPath:', parentPath, '\ntoPath:', toPath);
        this.hide(parentPath, toPath);
      }
      console.log(`HIDE ${fromPath} END`);
    },
    /*
      模块销毁方法
    */
    destroy(path) {
      console.log(`DESTROY ${path} NODE`);
      if (typeof path !== 'string') {
        return;
      }
      this.hide(path);
      let node = this.findNode(path);
      if (node.status === 'built') {
        node.template = null;
        node.script = null;
        node.status = 'unloaded';
      }
      console.log(`DESTROY ${path} END`);
    },
    /*
      找到当前路径上的目标节点
      param: path,
      return: '/a/c'||'/a/c/' -> object c :{}, 
                          '/' -> undifined, 
              没有的模块跳转到'/404'
    */
    findNode(path) {
      if (typeof path !== 'string' || path === '/') {
        return;
      }
      let node = this;
      this.pathParse(path).forEach(function(item) {
        if (typeof node.children[item] !== 'undefined') {
          node = node.children[item];
        }
      });
      return node;
    },
    /* 
      找到当前路径的父节点，
      params： path
      return：    '/a/c' -> {children:{}, compinent:'a'}, 
               undifined -> undifined, 
                     '/' -> undifined
    */
    findParent(path) {
      if (typeof path !== 'string' || path === '/') {
        return;
      }
      return this.findNode(this.parentPath(path));
    },
    /*
      找到当前路径的父路径
      param: path
      return:      '/' -> undifined, 
              '/a/c/d' -> 'a/c', 
                  '/a' -> '/'
    */
    parentPath(path) {
      if (path === '/' || typeof path !== 'string') {
        return;
      }
      let tmpArr = this.pathParse(path);
      tmpArr.length -= 1;
      path = tmpArr.join('/');
      return path ? path : '/';
    },
    /*
      将path根据'/'切分成数组，方便操作
      param: path,
      return: '/a/c' -> ['a','c'], 
                 '/' -> []
    */
    pathParse(path) {
      if (typeof path !== 'string') {
        return [];
      }
      path = path.split('/');
      if (path[0] === '') {
        path.splice(0, 1);
      }
      if (path[path.length - 1] === '') {
        path.splice(length - 1, 1);
      }
      return path;
    },
    loadScriptString(code) {
      if (typeof code !== 'string') { return; }
      var script = document.createElement('script');
      script.type = 'text/javascript';
      try {
        script.appendChild(document.createTextNode(code));
      } catch (ex) {
        script.text = code;
      }
      document.body.appendChild(script);
    },
    jump(from, to) {
      if (typeof from !== 'string' && typeof to !== 'string') { return; }
      let sameParentPath = this.getSameParentPath(from, to);
      console.log('共同的parent：', sameParentPath);
      this.hide(from, sameParentPath);
      this.show(to);
      console.log(UMI);
    },
    getSameParentPath(from, to) {
      if (typeof from !== 'string' && typeof to !== 'string') { return; }
      let fromArr = this.pathParse(from);
      let toArr = this.pathParse(to);
      let result = [];
      //保证formArr短
      if (fromArr.length > toArr.length) {
        let tmp = fromArr;
        fromArr = toArr;
        toArr = tmp;
      }
      for (let i = 0, len = fromArr.length; i < len; i++) {
        if (fromArr[i] == toArr[i]) {
          result.push(toArr[i]);
        } else {
          break;
        }
      }
      return `/${result.join('/')}`;
    }
  };
  UMI.parse(routes);

  return function(context) {
    console.log('--------  router middleware  --------');
    let req = context.request;
    let path = req.hash.substr(1);
    console.log('context:', context);
    console.log('path:', path);
    if (!current) {
      current = path;
      UMI.show(path);
    }
    if (current !== path) {
      console.log('jump from', current, 'to', path);
      UMI.jump(current, path);
      current = path;
    }
    console.log('--------end router middleware--------');
  };
}
router.redirect = function(hash) {
  location.href = location.origin + location.pathname + '#' + hash;
};

module.exports = router;
