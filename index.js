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

module.exports = jsonp;

function jsonp(app, options) {
  options = options || {};
  var callback = options.callback || 'callback';

  Object.defineProperty(app.context, 'jsonp', {
    set: function (obj) {
      if (!this.query[callback]) {
        return this.body = obj;
      }

      this.set('X-Content-Type-Options', 'nosniff');
      this.type = 'js';
      this.body = jsonpBody(obj, this.query[callback], options);
    }
  });
}
