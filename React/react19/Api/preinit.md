# preinit

预获取资源(包括 style 样式表、 script 外部脚本)

React 框架已经内置了资源处理方案，因此不必手动调用

## 使用场景

1. 样式预初始化
2. 脚本预初始化
3. 性能优化场景
   1. 关键路径渲染优化
   2. 首屏加载优化
   3. 大型应用分包加载
   4. 第三方资源优化

## 注意

1. preinit 会立即加载执行资源
2. 对于样式文件，可以通过 precedence 控制加载顺序
3. 建议只对真正需要立即使用的资源使用 preinit
4. 要考虑资源大小对性能的影响

## preinit(href, options)

```ts
type PreinitOptions = {
  // 资源类型 script、style
  as: string,
  // as='style' 时必须，优先级 指定样式表相对于其他样式表的插入位置，reset/low/medium/high
  precedence?: string,
  // CORS 策略
  crossOrigin?: string,
  // 资源的加密哈希
  integrity?: string,
  // 使用严格内容安全策略时允许资源的加密随机数
  nonce?: string,
  // 建议获取资源的相对优先级 auto(默认值)/high/low
  fetchPriority?: FetchPriorityEnum,
};
function preinit(href: string, options: PreinitOptions) {
  // 缩减后的代码
  if(as === 'style') {
    ReactDOMSharedInternals.d /* ReactDOMCurrentDispatcher */
      .S(
        /* preinitStyle */
        href,
        typeof options.precedence === 'string'
          ? options.precedence
          : undefined,
        {
          crossOrigin,
          integrity,
          fetchPriority,
        },
      );
  }else if(as === 'script') {
    ReactDOMSharedInternals.d /* ReactDOMCurrentDispatcher */
      .X(/* preinitScript */ href, {
        crossOrigin,
        integrity,
        fetchPriority,
        nonce: typeof options.nonce === 'string' ? options.nonce : undefined,
      });
  }
}
```
