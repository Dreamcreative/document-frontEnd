# HTTP 缓存策略

> 通过设置 HTTP 请求头来实现

## 强缓存

1. expires： `HTTP1.0 规范`

> 是一个`绝对时间的 GMT 格式的时间字符串`，如果发送请求的时间在 expires 之前，那么本地缓存始终有效，否则会发送请求重新获取资源

2. Cache-Control: `HTTP1.1 规范`

   1. max-age： 是一个相对值，资源第一次的请求时间与 Cache-Control 设定的有效期，计算出一个资源过期时间，再拿这个过期时间跟当前的请求时间比较，如果请求时间在过期时间之前，就能命中缓存，否则重新请求
   2. no-cache： 不使用本地缓存。需要使用协商缓存，
   3. no-store： 直接禁止使用缓存，每次用户请求资源，都会向服务器发送一个请求，每次都会重新下载资源
   4. public： 可以被所有的用户缓存，包括终端用户和 CDN 等中间代理服务器
   5. private： 只能被终端用户的浏览器缓存，不允许 CDN 等中间代理服务器缓存

> expries 和 Cache-Control 同时存在时，Cache-Control 的优先级高于 expires

> 强缓存命中时，会直接从本地缓存中返回数据，返回值 200

## 协商缓存

当没有强缓存时，会向服务器寻求帮助。如果命中协商缓存则返回 304 状态码，并且从本地返回缓存内容。如果没有命中则重新请求。

1. Last-Modified/ If-Modified-Since：表示资源在服务器上的`最后修改时间`

   1. 第一次请求时，服务器 `Response Header`通过 `Last-Modify`返回资源的`最后修改时间`，
   2. 再次请求资源时，客户端 `Request Header`通过`If-Modified-Since`携带着上一次服务器返回的`最后修改时间`，发送给服务器
   3. 如果资源的最后修改时间没有改变，那么直接返回 304，客户端使用本地缓存

2. Etag / If-None-Match：服务器会根据资源内容为每个资源生成一个`唯一标识字符串`，只要资源有变化，Etag 就会变化

   1. 第一次请求时，服务器 `Response Header` 通过 `Etag`返回资源的 `唯一标识`，
   2. 再次请求时，客户端 `Request Header`通过 `If-None-Match`携带着上一次服务器返回的`资源的唯一标识`，发送给服务器
   3. 如果资源的唯一标识没有改变，那么直接返回 304，客户端使用本地缓存

以下情况需要使用协商缓存

1.  一些文件也许会周期性的修改，但是内容并不改变(仅仅改变的修改时间)，这时我们不希望客户端认为这个文件被修改了，而重新请求
2.  某些文件修改非常频繁，比如在秒以下的时间内进行修改(1 秒内修改 N 次)，If-Modified-Since 能检查到的粒度是`秒级`的，而 expires 检查不到资源秒级的改变
3.  某些服务器不能精确的得到文件的最后修改时间

## Etag 和 Last-Modified 的区别

1.  `Last-Modified` 有时候并不太准确，当仅仅只修改了一个文件的内容，但是由于所有文件都重新提交了（所有文件的`Last-Modified` 都会改变），会导致其他未修改文件的缓存失效。
2.  `Etag` 是根据文件内容生成的`唯一标识`，不会因为文件重新提交而导致未改变的资源缓存失效。
3.  当同时具有`Etag`、`Last-Modified`时，`Etag`的优先级高于`Last-Modified`

## Expires 和 Cache-Control 区别

1.  Expires 是 HTTP1.0 的规范：是一个 `绝对时间`
2.  Cache-Control 是 HTTP1.1 的规范
3.  当同时存在 Expires 和 `Cache-Control`时，`Cache-Control`的优先级高

## 参考

- [HTTP 缓存和浏览器的本地存储](https://segmentfault.com/a/1190000020086923)
- [HTTP 缓存机制的 Etag、Last-Modified、If-None-Match 和 If-Modified-Since、Expires 和 Cache-Control 笔记](https://blog.nowcoder.net/n/d37337b3ab084cd2a94b7e6fe266bcd1)
