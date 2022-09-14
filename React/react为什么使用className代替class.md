# react 为什么使用 className 代替 class

> React 一开始的理念就是`与浏览器的 DOM 保持一致`

> DOM 在元素上设置 `class` 需要使用 className

```js
const arr = document.createElement('div');
div.className = 'class';
```
