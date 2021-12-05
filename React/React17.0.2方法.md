# React 17.0.2 方法

## React.memo(type, compare) 是一个高阶组件

> 参数

   1. type：需要缓存的组件
   2. compare：自定义比较函数

> `React.memo`通过浅比较 props 属性，来判断是否重用上次的渲染节点

> `React.memo`与`React.PureComponent 纯组件` 类似

## React.Component

> 使用 `ES6 类`定义的 React 组件基类

## React.PureComponent

> `React.PureComponent`与`React.Component` 类似，区别主要在与 `React.PureComponent`实现了 `shouldComponentUpdate() 通过浅比较 prop 和 state`,

## React.createElement(type, props, children) 创建并返回给定类型的 React 元素

> 参数

   1. type 节点名称
   2. props 节点属性
   3. children 当前节点的子节点

## React.cloneElement(element, config, children) 克隆并返回一个新的 React 元素

> 参数

  1. element 需要克隆的 React 元素
  2. config 新节点包含的属性
  3. children 新的子节点，取代目标节点 element 的子节点

## React.createFactory(type) 返回一个生成给定类型的 React 元素的函数

## React.isValidElement(object) 验证对象是一个 React 元素 ，true / flase

## React.Children

### React.Children.map(children, function(){})

### React.Children.forEach(children, function(){})

### React.Children.count(children) 返回组件总数

### React.Children.only(children) 验证 children 只有一个子元素

### React.Children.toArray(children) 将 children 扁平化返回

## React.Fragment 空标签 ，简写形式：<></>

## React.createRef() 创建一个 ref 返回

## React.forwardRef() 创建一个 React 组件，将接收到的 ref 属性传递给创建的 React 元素

## React.lazy() 允许动态加载组件，

> `const SomeComponent = React.lazy(()=> import('./SomeComponent'))`

## React.Suspense() 在组件未完成渲染前，添加一个指定的加载组件

```js
const OtherComponent = React.lazy(()=> import('./OtherComponent'));
function MyComponent(){
    return(
        <React.Suspense fallback={<Spinner />}>
            <div>
                <OtherComponent />
            </div>
        </React.Suspense>
    )
}
```

## 参考

* [React Top-Level API](https://reactjs.org/docs/react-api.html)