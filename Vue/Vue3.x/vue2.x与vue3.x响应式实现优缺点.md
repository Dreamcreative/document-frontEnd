# vue2.x 与 vue3.x 响应式实现优缺点

1. Proxy(target, handler)

   1. Proxy 可以直接监听对象而不是属性
   2. Proxy 可以直接监听数组变化
   3. Proxy 具有多种拦截方法，不限于 `apply, get, set, deleteProperty` 等等,而 `Object.defineProperty` 不具备
   4. Proxy 返回的是一个新对象，我们可以只操作新的对象达到目的，而 `Object.defineProperty` 只能遍历对象属性直接修改
   5. Proxy 作为新标准将受到浏览器厂商重点持续的性能优化

2. `Object.defineProperty(obj, prop, descriptor)`

   1. 兼容性好，支持 IE9,而 `Proxy`存在浏览器兼容问题，而且无法使用 polyfill 实现
   2. 只是对对象属性进行劫持
   3. 无法监听属性的 `新增`、`删除`
   4. 深层对象的劫持需要一次性递归，消耗性能
   5. 劫持数组时，需要重写部分`Array.prototype` 原生方法 `push`、`pop`、`shift`、`unshift`、`splice`、`sort`、`reverse`,

## Proxy 的局限性

1. 许多内置对象，例如`Map`、`Set`、`Date`、`Promise` 对象都使用所谓的`内部插槽`即`内置方法`，内置方法无法被直接调用。而 `Proxy` 无法拦截这些内部方法
