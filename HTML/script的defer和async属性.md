# script 的 defer 和 async 属性

> 浏览器在执行 HTML 的过程中，一旦遇到 script 标签，会将 HTML 的解析挂起，先下载 script 资源，再进行解析 javascript，当 script 的资源下载解析完毕之后，才会继续执行 HTML 的解析。这一过程会导致浏览器白屏

> 在 HTML4 中，定义了 defer

> 在 HTML5 中，定义了 async

![script默认加载](/images/HTML/script_default.webp)

## defer 延迟

> 表示 script 资源会被立即异步下载，但是会在 HTML 渲染完毕之后再对 script 资源进行解析

> 具有 defer 属性的 script 标签内部不会生成 `document.write`

![script defer 加载](/images/HTML/script_defer.webp)

## async 异步

> 表示 script 资源会立即异步下载，当资源下载完毕之后，会马上暂停 DOM 的解析（如果 DOM 还没有解析完成），并开始执行 JavaScript。

> 如果多个 script 都具有 async 属性，但是由于 script 资源下载的速度快慢不一定，所以会导致 script 资源不会按照页面中引入的顺序进行执行

![script async 加载](/images/HTML/script_async.webp)

## 区别

### defer 和 async 相同点

1. 加载文件时不阻塞 HTML 的渲染，异步下载 script 资源
2. 对于 inline 的 script 无效，当 script 没有 src 属性时，defer 和 async 属性都无效
3. 有脚本的 onload 事件回调

### defer 和 async 不同点

1. defer 是 HTML4 中定义的属性
2. async 是 HTML5 中定义的属性
3. 当 script 标签同时具有 defer 和 async 属性时，async 的优先级高于 defer 属性，除非 浏览器不支持 async

## 参考

- [图解 script 标签中的 async 和 defer 属性](https://juejin.cn/post/6894629999215640583)
- [浅析 script 标签的 async 和 defer 属性](https://segmentfault.com/a/1190000037724479)
