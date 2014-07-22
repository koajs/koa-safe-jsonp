koa-safe-jsonp
=======

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][coveralls-image]][coveralls-url]
[![Gittip][gittip-image]][gittip-url]
[![David deps][david-image]][david-url]

[npm-image]: https://img.shields.io/npm/v/koa-safe-jsonp.svg?style=flat
[npm-url]: https://npmjs.org/package/koa-safe-jsonp
[travis-image]: https://img.shields.io/travis/koajs/koa-safe-jsonp.svg?style=flat
[travis-url]: https://travis-ci.org/koajs/koa-safe-jsonp
[coveralls-image]: https://img.shields.io/coveralls/koajs/koa-safe-jsonp.svg?style=flat
[coveralls-url]: https://coveralls.io/r/koajs/koa-safe-jsonp?branch=master
[gittip-image]: https://img.shields.io/gittip/fengmk2.svg?style=flat
[gittip-url]: https://www.gittip.com/fengmk2/
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

(The MIT License)

Copyright (c) 2014 fengmk2 &lt;fengmk2@gmail.com&gt; and other contributors

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
