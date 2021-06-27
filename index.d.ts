import Koa = require('koa');
import jsonpBody = require('jsonp-body');

declare namespace jsonp {
  interface Options extends jsonpBody.Options {
    /** callback name, default to `callback` */
    callback?: string;
  }
}

declare function jsonp(app: Koa, options?: jsonp.Options): Koa.Middleware;

export = jsonp;
