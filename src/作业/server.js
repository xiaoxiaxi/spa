const express = require('express');
const expressStatic = require('express-static');

let server = express();
server.listen(8080);

server.post('/getsession', (req, res) => {
  //do something by cookies
  //返回相应的session信息
  res.json({ user: '小明' });
})

server.get('/', (req, res) => {
  res.redirect('/index.html');
});

server.use('/', expressStatic('./public'));