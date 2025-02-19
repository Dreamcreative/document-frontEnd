# preinitModule

preinitModule 预初始化 ES 模块资源，如果不是 ES 模块资源，使用 `preinit`

## preinitModule(href, options)

```ts
type PreinitModuleOptions = {
  // 目前只支持 script
  as?: string,
  // 使用的 CORS 策略
  crossOrigin?: string,
  // 资源的加密哈希
  integrity?: string,
  // 使用严格内容安全策略时允许资源的加密随机数
  nonce?: string,
};
function preinitModule(href: string, options?: ?PreinitModuleOptions) {
  if (typeof href === 'string') {
    if (typeof options === 'object' && options !== null) {
      if (options.as == null || options.as === 'script') {
        const crossOrigin = getCrossOriginStringAs(
          options.as,
          options.crossOrigin,
        );
        ReactDOMSharedInternals.d /* ReactDOMCurrentDispatcher */
          .M(/* preinitModuleScript */ href, {
            crossOrigin,
            integrity: typeof options.integrity === 'string' ? options.integrity : undefined,
            nonce: typeof options.nonce === 'string' ? options.nonce : undefined,
          });
      }
    } else if (options == null) {
      ReactDOMSharedInternals.d /* ReactDOMCurrentDispatcher */
        .M(/* preinitModuleScript */ href);
    }
  }
}
```
