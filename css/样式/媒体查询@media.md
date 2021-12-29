# 媒体查询 @media

> 当重置浏览器大小的过程中，页面会根据浏览器的高度、宽度重新渲染页面

  * 使用媒体查询 `@media`，可以针对不同的媒体类型定义不同的样式
  * `@media`可以针对不同的屏幕尺寸设置不同的样式，特别是需要设置响应式的页面

```js
// 使用 link 标签
<link rel="stylesheet" media="(max-width: 800px)" href="example.css" />
```

```css
/* 样式表中的 媒体查询 */
@media (max-width: 600px){
  .box{
    background-color: red;
  }
}
```
