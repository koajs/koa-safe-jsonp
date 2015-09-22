koa-safe-jsonp
=======

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]

[npm-image]: https://img.shields.io/npm/v/koa-safe-jsonp.svg?style=flat
[npm-url]: https://npmjs.org/package/koa-safe-jsonp
[travis-image]: https://img.shields.io/travis/koajs/koa-safe-jsonp.svg?style=flat
[travis-url]: https://travis-ci.org/koajs/koa-safe-jsonp
[codecov-image]: https://codecov.io/github/koajs/koa-safe-jsonp/coverage.svg?branch=master
[codecov-url]: https://codecov.io/github/koajs/koa-safe-jsonp?branch=master
[david-image]: https://img.shields.io/david/koajs/koa-safe-jsonp.svg?style=flat
[david-url]: https://david-dm.org/koajs/koa-safe-jsonp

Safe jsonp plusins for koa.

## Install

```bash
$ npm install koa-safe-jsonp
```

## Usage

```js
var jsonp = require('koa-safe-jsonp');
var koa = require('koa');

var app = koa();
jsonp(app, {
  callback: '_callback', // default is 'callback'
  limit: 50, // max callback name string length, default is 512
});

app.use(function* () {
  this.jsonp = {foo: "bar"};
});

app.listen(1984);
```

curl test it:

```bash
$ curl 'http://127.0.0.1:1984/foo.json?_callback=fn' -v

* About to connect() to 127.0.0.1 port 1984 (#0)
*   Trying 127.0.0.1...
* Adding handle: conn: 0x7fca3c004000
* Adding handle: send: 0
* Adding handle: recv: 0
* Curl_addHandleToPipeline: length: 1
* - Conn 0 (0x7fca3c004000) send_pipe: 1, recv_pipe: 0
* Connected to 127.0.0.1 (127.0.0.1) port 1984 (#0)
> GET /foo.json?_callback=fn HTTP/1.1
> User-Agent: curl/7.30.0
> Host: 127.0.0.1:1984
> Accept: */*
>
< HTTP/1.1 200 OK
< X-Powered-By: koa
< X-Content-Type-Options: nosniff
< Content-Type: application/javascript
< Content-Length: 51
< Date: Thu, 17 Jul 2014 15:29:05 GMT
< Connection: keep-alive
<
* Connection #0 to host 127.0.0.1 left intact
/**/ typeof fn === 'function' && fn({"foo":"bar"});
```

## License

[MIT](./LICENSE)
