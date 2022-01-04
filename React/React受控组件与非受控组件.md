# React 受控组件与非受控组件

## 受控组件

> 如果将`React`中的 `state` 属性和表单元素的值建立依赖关系，再通过`onChange`事件结合更新 `state` 属性，就能达到控制用户输入过程中表单发生的操作。`通过代码控制表单元素的值、值验证等控制操作`

## 非受控组件

> 表单数据由 DOM 本身处理，不受到 `React`中 `setState()` 控制，需要获取表单元素的值时，需要从表单元素的实例中获取`使用 ref 从 DOM 获取`

## 参考

* [受控和非受控组件真的那么难理解吗？(React实际案例详解)](https://juejin.cn/post/6858276396968951822#heading-7)
* [非受控组件](https://zh-hans.reactjs.org/docs/uncontrolled-components.html)
