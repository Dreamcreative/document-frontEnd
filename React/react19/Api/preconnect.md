# preconnect

`用于优化网页性能`

preconnect 可以帮助提前连接到一个期望从中加载资源的服务器

preconnect 函数向浏览器提供一个提示，告诉它应该打开到给定服务器的连接，如果浏览器这么做，则可以加快从该服务器加载资源的速度

## 使用场景

1. 提前建立连接
   1. 当你知道即将从某个域名加载资源时，可以提前建立连接
   2. 减少实际请求时的连接建立时间
2. 第三方资源优化
3. 性能提升
   1. 可以节省 100-500ms 的连接时间
   2. 特别适合需要建立安全连接(HTTPS)的场景，因为 TLS 握手比较耗时

## 注意

1. 不要过度使用 preconnect,因为每个连接都会消耗系统资源
2. 建议只对关键资源使用
3. 连接会在空闲时关闭(通常是 10s)

* preconnect(href, options)

```ts
type PreconnectOptions = {crossOrigin?: string};
 c
function preconnect(href:string, options?: ?PreconnectOptions) {
  if(typeof href === 'string'){
    const crossOrigin = options
      ? getCrossOriginString(options.crossOrigin)
      :null;
    ReactDOMSharedInternals.d /* ReactDOMCurrentDispatcher */
      .C(/* preconnect */ href, crossOrigin);
  }
}
```
