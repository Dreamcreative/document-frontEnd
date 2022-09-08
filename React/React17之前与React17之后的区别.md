# React17之前与React17之后的区别

> React 17 并没有添加任何新功能。该版本主要侧重于`使 React 本身变得更容易`

## 对事件委托的更改

   1. React 17 不再在 `document 底层附加事件处理程序`，而是添加到`渲染 React 树的根节点 DOM 容器 <div id='root'></div>`。 
   2. React 17 不再使用事件池

## 返回未定义的一致错误

   > React 17 之前。返回`undefined 总是一个错误`。React 17 中， forwardRef 和 memo 组件的行为与常规的函数和类组件一致，返回`undefined` 将是一个错误。

   > 如果不想渲染任何内容， 返回 `null`

## 新的 JSX 转换

> React 17 之前，当使用 JSX 时，编译器会调用 `React.createElement()`，所以需要在组件中，手动引入 React `import React from 'react'`.

```jsx
import React from 'react';
function App(){
  return <div>
    <img src="avatar.png" className="profile" />
    <h3>{[user.firstName, user.lastName].join(" ")}</h3>
  </div>
}

// babel 转化后，会通过 React.createElement(type, props, children) 方法将 JSX 转化为 React 元素

"use strict";

function App() {
  return /*#__PURE__*/ React.createElement(
    "div",
    null,
    /*#__PURE__*/ React.createElement("img", {
      src: "avatar.png",
      className: "profile"
    }),
    /*#__PURE__*/ React.createElement(
      "h3",
      null,
      [user.firstName, user.lastName].join(" ")
    )
  );
}
```

> React 17 之后，为 React 包引入了两个新的入口点`react/jsx-runtime` 和 `react/jsx-dev-runtime` ，不再需要在组件顶部引入 React

```jsx
function App(){
  return <div>
    <img src="avatar.png" className="profile" />
    <h3>{[user.firstName, user.lastName].join(" ")}</h3>
  </div>
}
// babel 8 转化后，会自动引入 react/jsx-runtime,不再调用 React.createElement(type, props, children)

"use strict";

var _jsxRuntime = require("react/jsx-runtime");

function App() {
  return /*#__PURE__*/ (0, _jsxRuntime.jsxs)("div", {
    children: [
      /*#__PURE__*/ (0, _jsxRuntime.jsx)("img", {
        src: "avatar.png",
        className: "profile"
      }),
      /*#__PURE__*/ (0, _jsxRuntime.jsx)("h3", {
        children: [user.firstName, user.lastName].join(" ")
      })
    ]
  });
}
```

## 等等 。。。

## 参考

* [React v17.0](https://reactjs.org/blog/2020/10/20/react-v17.html)
* [React v17.0 候选版本：没有新功能](https://reactjs.org/blog/2020/08/10/react-v17-rc.html#other-breaking-changes)
* [介绍新的 JSX 转换](https://reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html)
