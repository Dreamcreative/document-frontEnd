# prefetchDNS

prefetchDNS 允许提前查找期望从中加载资源的服务器 IP

## 使用场景

1. DNS 预解析优化
   1. 提前解析即将访问的域名
   2. 减少用户实际请求时的 DNS 查询延迟
   3. 特别适合多域名场景
2. 常见应用场景
   1. 电商网站的商品图片 CDN
   2. 社交媒体的外部链接
   3. 第三方服务域名
   4. 分布式架构中的微服务域名

## 注意

1. DNS 预解析虽然开销较小，但也不要过度使用
2. 浏览器对 DNS 缓存有时间限制
3. 与 preconnect 相比，prefetchDNS 开销更小，但是优化效果也相对较小
4. 不需要设置 crossOrigin 参数,因为 DNS 不涉及跨域请求

* prefetchDNS(href)

```ts
function prefetchDNS(href: string) {
  if (typeof href === 'string') {
    ReactDOMSharedInternals.d /* ReactDOMCurrentDispatcher */
      .D(/* prefetchDNS */ href);
  }
}
```
