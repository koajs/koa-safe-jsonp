'use strict';

const Koa = require('koa');
const qs = require('koa-qs');
const request = require('supertest');
const jsonp = require('..');

describe('index.test.js', function () {
  it('should send normal response when callback missing', function (done) {
    const app = new Koa();
    jsonp(app);

    // Koa@1.X.X
    // app.use(function (ctx) {
    //   ctx.jsonp = {foo: 'bar'};
    // });

    app.use(function (ctx) {
      ctx.jsonp = { foo: 'bar' };
    });

    request(app.listen())
      .get('/foo.json?foo=fn')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect('{"foo":"bar"}')
      .expect(200, done);
  });

  it('should send normal response when callback is empty string', function (done) {
    const app = new Koa();
    jsonp(app);
    app.use(function (ctx) {
      ctx.jsonp = { foo: 'bar' };
    });

    request(app.listen())
      .get('/foo.json?foo=fn&callback=')
      .expect('Content-Type', 'application/json; charset=utf-8')
      .expect('{"foo":"bar"}')
      .expect(200, done);
  });

  it('should send jsonp response with default callback', function (done) {
    const app = new Koa();
    jsonp(app);
    app.use(function (ctx) {
      ctx.jsonp = { foo: 'bar' };
    });

    request(app.listen())
      .get('/foo.json?callback=fn')
      .expect('Content-Type', 'application/javascript; charset=utf-8')
      .expect('X-Content-Type-Options', 'nosniff')
      .expect('/**/ typeof fn === \'function\' && fn({"foo":"bar"});')
      .expect(200, done);
  });

  it('should send jsonp response with array callback', function (done) {
    const app = new Koa();
    qs(app);
    jsonp(app);
    app.use(function (ctx) {
      ctx.jsonp = { foo: 'bar' };
    });

    request(app.listen())
      .get('/foo.json?callback=fn&callback=cb')
      .expect('Content-Type', 'application/javascript; charset=utf-8')
      .expect('X-Content-Type-Options', 'nosniff')
      .expect('/**/ typeof fn === \'function\' && fn({"foo":"bar"});')
      .expect(200, done);
  });

  it('should send number response', function (done) {
    const app = new Koa();
    jsonp(app);
    app.use(function (ctx) {
      ctx.jsonp = 1984;
    });

    request(app.listen())
      .get('/foo.json?callback=fn')
      .expect('Content-Type', 'application/javascript; charset=utf-8')
      .expect('X-Content-Type-Options', 'nosniff')
      .expect("/**/ typeof fn === 'function' && fn(1984);")
      .expect(200, done);
  });

  it('should send string response', function (done) {
    const app = new Koa();
    jsonp(app);
    app.use(function (ctx) {
      ctx.jsonp = '1984';
    });

    request(app.listen())
      .get('/foo.json?callback=fn')
      .expect('Content-Type', 'application/javascript; charset=utf-8')
      .expect('X-Content-Type-Options', 'nosniff')
      .expect('/**/ typeof fn === \'function\' && fn("1984");')
      .expect(200, done);
  });

  it('should send jsonp response with custom callback', function (done) {
    const app = new Koa();
    jsonp(app, {
      callback: '_callback'
    });
    app.use(function (ctx) {
      ctx.jsonp = { foo: 'bar' };
    });

    request(app.listen())
      .get('/foo.json?_callback=$jsonp_callback')
      .expect('Content-Type', 'application/javascript; charset=utf-8')
      .expect('X-Content-Type-Options', 'nosniff')
      .expect(
        '/**/ typeof $jsonp_callback === \'function\' && $jsonp_callback({"foo":"bar"});'
      )
      .expect(200, done);
  });

  it('should limit callback name length to 10', function (done) {
    const app = new Koa();
    jsonp(app, {
      callback: '_callback',
      limit: 10
    });
    app.use(function (ctx) {
      ctx.jsonp = { foo: 'bar' };
    });

    request(app.listen())
      .get(
        '/foo.json?_callback=$123456789jsonp_callbackjsonp_callbackjsonp_callback'
      )
      .expect('Content-Type', 'application/javascript; charset=utf-8')
      .expect('X-Content-Type-Options', 'nosniff')
      .expect(
        '/**/ typeof $123456789 === \'function\' && $123456789({"foo":"bar"});'
      )
      .expect(200, done);
  });

  it('should dont limit when callback name length < limit options', function (done) {
    const app = new Koa();
    jsonp(app, {
      callback: '_callback',
      limit: 10
    });
    app.use(function (ctx) {
      ctx.jsonp = { foo: 'bar' };
    });

    request(app.listen())
      .get('/foo.json?_callback=$123')
      .expect('Content-Type', 'application/javascript; charset=utf-8')
      .expect('X-Content-Type-Options', 'nosniff')
      .expect('/**/ typeof $123 === \'function\' && $123({"foo":"bar"});')
      .expect(200, done);
  });
});