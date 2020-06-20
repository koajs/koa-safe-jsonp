'use strict';

const jsonp = require('..');
const koa = require('koa');

const app = koa();
jsonp(app, {
  callback: '_callback' // default is 'callback'
});

app.use(function* () {
  this.jsonp = { foo: 'bar' };
});

app.listen(1984);