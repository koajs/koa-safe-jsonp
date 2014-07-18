/**!
 * koa-safe-jsonp - test/index.test.js
 *
 * Copyright(c) 2014 fengmk2 and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 */

"use strict";

/**
 * Module dependencies.
 */

var should = require('should');
var koa = require('koa');
var request = require('supertest');
var jsonp = require('../');

describe('index.test.js', function () {
  it('should send json response without padding when callback missing', function (done) {
    var app = koa();
    jsonp(app);
    app.use(function* () {
      this.jsonp = {foo: 'bar'};
    });

    request(app.listen())
    .get('/foo.json?foo=fn')
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect('X-Content-Type-Options', 'nosniff')
    .expect('{"foo":"bar"}')
    .expect(200, done);
  });

  it('should send jsonp response with default callback', function (done) {
    var app = koa();
    jsonp(app);
    app.use(function* () {
      this.jsonp = {foo: 'bar'};
    });

    request(app.listen())
    .get('/foo.json?callback=fn')
    .expect('Content-Type', 'application/javascript')
    .expect('X-Content-Type-Options', 'nosniff')
    .expect('/**/ typeof fn === \'function\' && fn({"foo":"bar"});')
    .expect(200, done);
  });

  it('should send number response', function (done) {
    var app = koa();
    jsonp(app);
    app.use(function* () {
      this.jsonp = 1984;
    });

    request(app.listen())
    .get('/foo.json?callback=fn')
    .expect('Content-Type', 'application/javascript')
    .expect('X-Content-Type-Options', 'nosniff')
    .expect('/**/ typeof fn === \'function\' && fn(1984);')
    .expect(200, done);
  });

  it('should send string response', function (done) {
    var app = koa();
    jsonp(app);
    app.use(function* () {
      this.jsonp = '1984';
    });

    request(app.listen())
    .get('/foo.json?callback=fn')
    .expect('Content-Type', 'application/javascript')
    .expect('X-Content-Type-Options', 'nosniff')
    .expect('/**/ typeof fn === \'function\' && fn("1984");')
    .expect(200, done);
  });

  it('should send jsonp response with custom callback', function (done) {
    var app = koa();
    jsonp(app, {
      callback: '_callback'
    });
    app.use(function* () {
      this.jsonp = {foo: 'bar'};
    });

    request(app.listen())
    .get('/foo.json?_callback=$jsonp_callback')
    .expect('Content-Type', 'application/javascript')
    .expect('X-Content-Type-Options', 'nosniff')
    .expect('/**/ typeof $jsonp_callback === \'function\' && $jsonp_callback({"foo":"bar"});')
    .expect(200, done);
  });
});

describe('index.test.js - middleware', function () {
  it('should send json response without padding when callback missing', function (done) {
    var app = koa();
    app.use(jsonp.middleware());
    app.use(function* () {
      this.body = {foo: 'bar'};
    });

    request(app.listen())
    .get('/foo.json?foo=fn')
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect('{"foo":"bar"}')
    .expect(200, done);
  });

  it('should send json response when http method is not GET', function (done) {
    var app = koa();
    app.use(jsonp.middleware());
    app.use(function* () {
      this.body = {foo: 'bar'};
    });

    request(app.listen())
    .post('/foo.json?callback=fn')
    .send({})
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect('{"foo":"bar"}')
    .expect(200, done);
  });

  it('should send json response when response is not json or text', function (done) {
    var app = koa();
    app.use(jsonp.middleware());
    app.use(function* () {
      this.body = '<h1>foo:bar</h1>';
    });

    request(app.listen())
    .get('/foo.json?foo=fn')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect('<h1>foo:bar</h1>')
    .expect(200, done);
  });

  it('should send jsonp response with default callback', function (done) {
    var app = koa();
    app.use(jsonp.middleware());
    app.use(function* () {
      this.body = {foo: 'bar'};
    });

    request(app.listen())
    .get('/foo.json?callback=fn')
    .expect('Content-Type', 'application/javascript')
    .expect('X-Content-Type-Options', 'nosniff')
    .expect('/**/ typeof fn === \'function\' && fn({"foo":"bar"});')
    .expect(200, done);
  });

  it('should send number response', function (done) {
    var app = koa();
    app.use(jsonp.middleware());
    app.use(function* () {
      this.body = 1984;
    });

    request(app.listen())
    .get('/foo.json?callback=fn')
    .expect('Content-Type', 'application/javascript')
    .expect('X-Content-Type-Options', 'nosniff')
    .expect('/**/ typeof fn === \'function\' && fn(1984);')
    .expect(200, done);
  });

  it('should send string response', function (done) {
    var app = koa();
    app.use(jsonp.middleware());
    app.use(function* () {
      this.body = '1984';
    });

    request(app.listen())
    .get('/foo.json?callback=fn')
    .expect('Content-Type', 'application/javascript')
    .expect('X-Content-Type-Options', 'nosniff')
    .expect('/**/ typeof fn === \'function\' && fn("1984");')
    .expect(200, done);
  });

  it('should send jsonp response with custom callback', function (done) {
   var app = koa();
    app.use(jsonp.middleware({
      callback: '_callback'
    }));
    app.use(function* () {
      this.body = {foo: 'bar'};
    });

    request(app.listen())
    .get('/foo.json?_callback=$jsonp_callback')
    .expect('Content-Type', 'application/javascript')
    .expect('X-Content-Type-Options', 'nosniff')
    .expect('/**/ typeof $jsonp_callback === \'function\' && $jsonp_callback({"foo":"bar"});')
    .expect(200, done);
  });
});
