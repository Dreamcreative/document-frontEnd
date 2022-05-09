# 对 css 工程化的理解

## css 工程化是为了解决以下问题

  * 宏观设计：css 代码如何组织，如何拆分，模块结构怎么设计
  * 编码优化：怎么样写出更好的 css
  * 构建：如何处理css,使它打包结果最优
  * 可维护性：使项目变得可维护

## 预处理器 sass/less/stylus/...

> 预处理器处理的是 `类css`,浏览器无法识别这种 `类css`,需要使用预处理器将它解析成 css

> 为什么要用预处理器，它的出现解决了什么问题

  1. 嵌套代码的能力
  2. 支持定义css 变量
  3. 提供计算函数
  4. 允许对代码片段进行 extend 和 mixin
  5. 支持循环语句的使用
  6. 支持将 css 文件模块化，实现复用

![预处理器处理css](/images/CSS/预处理器处理css.png)

## 后处理器 PostCss

> PostCss 处理的是 css 本身。可以编译尚未被浏览器广泛支持的先进 css 语法，还可以自动为一些语法添加兼容前缀。同时，PostCss 还具有强大的插件机制，极大的强化了 css 的能力

> PostCss 的作用

  1. 提高css 代码的可读性
  2. 使用 `Autoprefixer` 插件为css属性提供兼容性前缀
  3. 可以使用 cssnext 代码（目前浏览器不支持的 css 新特性）

![后处理器处理css](/images/CSS/后处理器处理css.png)

## webpack 处理 css

> webpack 处理 css 需要使用两个关键的 loader :`css-loader`、`style-loader`

  * `css-loader`:导入 css 模块，并对 css 代码进行编译处理
  * `style-loader`: 在页面中创建 `<style>`标签，将 css 内容写入标签中

> `css-loader`的使用顺序必须要在 `style-loader`的前面，因为只有完成了编译过程，才可以对 css 代码进行插入
