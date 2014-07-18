/**!
 * koa-safe-jsonp - index.js
 *
 * Copyright(c) fengmk2 and other contributors.
 * MIT Licensed
 *
 * Authors:
 *   fengmk2 <fengmk2@gmail.com> (http://fengmk2.github.com)
 */

'use strict';

/**
 * Module dependencies.
 */

var jsonpBody = require('jsonp-body');

exports = module.exports = jsonp;

function jsonp(app, options) {
  options = options || {};
  var callback = options.callback || 'callback';
  Object.defineProperty(app.context, 'jsonp', {
    set: function (obj) {
      this.set('X-Content-Type-Options', 'nosniff');
      var body = jsonpBody(obj, this.query[callback]);
      if (body.indexOf('/**/') === 0) {
        // jsonp response
        this.type = 'js';
      } else {
        // normal json response
        this.type = 'json';
      }
      this.body = body;
    }
  });
}

exports.middleware = function (options) {
  options = options || {};
  var callback = options.callback || 'callback';

  return function* (next) {
    yield* next;

    if (this.method === 'GET' && this.query[callback] &&
      (this.type === 'application/json' || this.type === 'text/plain')) {
      this.set('X-Content-Type-Options', 'nosniff');
      this.body = jsonpBody(this.body, this.query[callback]);
      this.type = 'js';
    }
  };
};