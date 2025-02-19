# preload

preload 预加载资源，比如样式表、字体、外部脚本、图片、视频、音频等

这个实现会生成类似 `<link rel='preload'/>` 的预加载指令

## preload(href, options)

```ts
export type PreloadOptions = {
  // 资源类型 audio、document、embed、fetch、font、image、object、script、style、track、video、worker
  as: string,
  // 使用的 CORS 策略 as='fetch'时，必填
  crossOrigin?: string,
  // 资源的加密哈希
  integrity?: string,
  // 资源的 MIME 类型
  type?: string,
  media?: string,
  // 使用严格内容安全策略时允许资源的加密随机数
  nonce?: string,
  // 获取资源的相对优先级
  fetchPriority?: FetchPriorityEnum,
  // as='image' 时，图片的源集
  imageSrcSet?: string,
  // as='image' 时，图片的尺寸
  imageSizes?: string,
  // 请求时发送的 referer请求头
  referrerPolicy?: string,
};
function preload(href: string, options: PreloadOptions) {

}
```
