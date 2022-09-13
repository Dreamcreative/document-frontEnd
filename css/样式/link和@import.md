# link 和 @import

1. 从属关系的区别

- link 是 HTML 标签，
- @import 是 css 提供的语法规则

2. 加载顺序区别

- link 标签引入的 css 被同时加载
- @import 在大多数情况下是并行下载的，只是不会与附表及其可能包含的任何 css 并行下载

> 第一个例子：在 `parent.css` 样式表中 `@import`引入的 css 都是`并行加载的`。并且同享相同的 TCP 链接

```html
<link media="screen" rel="stylesheet" type="text/css" href="parent.css" />

<!-- parent.css -->
@import url('child1.css'); @import url('child2.css'); @import url('child3.css'); @import url('child4.css');
```

> 第二个例子：`@import`嵌入在 HTML `<style></style>`标签中，也是`并行加载的，只是加载顺序随机`

```html
<style>
  @import url('child1.css');
  @import url('child2.css');
  @import url('child3.css');
  @import url('child4.css');
</style>
```

> 在第一个例子中，如果`parent.css`中只是引入 css,而没有其他 css ,`@import`会立即加载。但是如果 `parent.css`中除了引入其他 css 外，还有其他的 css 时，这时 `@import`会等待其他 css 解析下载完成之后才会开始加载，产生`阻塞`行为

```css
/* 这种具有 其他 css 的情况，@import 引入的 css 会等待 下面的css 解析、加载完成之后，才开始加载 */
/* parent.css  */
@import url('child1.css');
@import url('child2.css');
@import url('child3.css');
@import url('child4.css');

.box {
  font-size: 20px;
}
```

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
- [包含 CSS 的最佳方式？为什么要使用@import？](https://stackoverflow.com/questions/10036977/best-way-to-include-css-why-use-import)
