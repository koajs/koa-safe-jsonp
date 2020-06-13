'use strict';

const jsonp = require('.');
const Koa = require('koa');

const app = new Koa();
jsonp(app, {
  callback: '_callback' // default is 'callback'
});

app.use(function (ctx) {
  ctx.jsonp = { foo: 'bar' };
});

app.listen(1984);