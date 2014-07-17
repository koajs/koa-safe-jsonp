var jsonp = require('./');
var koa = require('koa');

var app = koa();
jsonp(app, {
  callback: '_callback' // default is 'callback'
});

app.use(function* () {
  this.body = this.jsonp({foo: 'bar'});
});

app.listen(1984);
