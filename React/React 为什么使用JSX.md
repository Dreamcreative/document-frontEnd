# React 为什么使用 JSX

## JSX 是什么

> JSX 是 JavaScript 的语法扩展，类似于模板语法，或者说是类似于 XML 的 ECMAScript 语法扩展，并且具备 JavaScript 的全部功能

- JSX 是 JavaScript 的语法扩展
- JSX 具备 JavaScript 的全部功能

## JSX 是如何在 JavaScript 中生效的

> 在 React 中，JSX 会被编译成 React.createElement(type, config, children),返回一个叫做 `React Element`的 JS 对象

> 由 babel 进行对 JSX 的编译

## template vs JSX

1. JSX 本质是 JavaScript，想实现条件渲染可以用 `if else`,也可以用`三元表达式`，还可以用任意合法的 JavaScript 语法，`JSX 可以支持更加动态的需求`
2. template 因为语法限制原因，不能像 JSX 那样可以支持更动态的需求。这是 JSX 的一个优势。JSX 还有一个优势，就是可以在一个文件中返回多个组件。
3. 就 Vue 来说，使用 template 语法是有原因的，template 由于语法固定，可以在编译层面做更多的优化，`比如静态标记就真正的做到了按需更新`。而 JSX 由于动态性太强，只能在有限的场景下做优化，虽然性能不如 template 好，但在某些动态性要求较高的场景下，JSX 处理会更好

## 参考

- [为什么 JSX 语法这么香？](https://juejin.cn/post/7112595039863177223)
