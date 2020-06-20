'use strict';

const jsonpBody = require('jsonp-body');

// eslint-disable-next-line func-names
module.exports = function jsonp(app, options) {
  options = options || {};
  const callback = options.callback || 'callback';

  // eslint-disable-next-line accessor-pairs
  Object.defineProperty(app.context, 'jsonp', {
    set(object) {
      const jsonpFunc = this.query[callback];
      // eslint-disable-next-line no-return-assign
      if (!jsonpFunc) return (this.body = object); // eslint-disable-line no-setter-return

      this.set('X-Content-Type-Options', 'nosniff');
      this.type = 'js';
      this.body = jsonpBody(object, jsonpFunc, options);
    },
    configurable: true
  });
};
