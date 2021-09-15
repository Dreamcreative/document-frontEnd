# link 和 @import

1. 从属关系的区别

- link 是 HTML 标签，
- @import 是 css 提供的语法规则

2. 加载顺序区别

- link 标签引入的 css 被同时加载
- @import 引入的 css 会等到页面加载完毕后加载

3. 兼容性区别

- link 标签是 HTML 元素，不存在兼容性
- @import 是 css2.1 才有的语法，只有 IE5+ 才能识别

4. DOM 可控性区别

- link 是 HTML 元素，可以通过 JavaScript 来操作
- @import 是 css 语法规则， 无法通过 JavaScript 操作

5. 优先级区别

> link 引入的样式优先级大于 @import 引入的样式

- 主要原因是：@import 引入的样式在 link 引入的样式之前，而之前定义的样式会被之后定义的样式覆盖，所以说 link 的优先级大于 @import

- @import 是在头部引入
- @import 引入 css 时，会被替换为引入的 css 样式，而浏览器渲染的动作会多次执行，之前定义的 css 样式会被之后定义的 css 样式覆盖
- @import 引入的样式在 link 引入的样式之前，所以如果存在相同属性的样式，@import 引入的样式会被 link 引入的样式覆盖掉

## 参考

- [link 和 @import 区别](https://juejin.cn/post/6844903581649207309)
