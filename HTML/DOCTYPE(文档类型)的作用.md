# DOCTYPE(文档类型)的作用

> DOCTYPE 是 HTML5 中一种标准通用标记语言的文档类型声明， 告诉浏览器（解析器）使用什么样文档类型定义（HTML/XHTML）来解析文档。不同的渲染模式会影响浏览器对 css 代码甚至 JavaScript 脚本的解析。必须声明在 HTML 文档的第一行

## 具有两种模式，

> 使用 `document.compatMode`获取

1. `CSS1Compat` 标准模式- `Strick mode`,默认模式，浏览器使用 W3C 的标准解析渲染页面。在标准模式中，浏览器以其支持的最高标准呈现页面
2. `BackCompat` 怪异模式- `Quick mode`，浏览器使用自己的怪异模式解析渲染页面。在怪异模式中，页面以一种比较宽松的向后兼容的方式显示
