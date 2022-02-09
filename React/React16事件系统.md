# React 16 事件系统

## 问题

  1. 我们写的事件是绑定在`dom`上的吗，如果不是那么绑定在哪里？

    * 不是绑定在`dom`上，而是绑定在`document`上，便于事件的统一管理

  2. 为什么我们的事件系统不能绑定给组件？

    * react 不将事件绑定在组件上而是绑定在`document`上，是为了便于事件的统一管理，进行事件的绑定，分发执行，事件的销毁,同时防止一些不可控的情况

  3. 为什么我们的事件手动绑定 `this`（不是监听函数的情况）？

    * 因为 dom 元素上的事件并不是绑定在当前元素节点上，而是绑定在 `document`，如果不绑定 `this`，会导致 `this`丢失

  4. 为什么不能用`return false`来阻止事件默认行为？

    * 合成事件中是通过 `e.isDefaultPrevented()`来判断，是否阻止事件默认行为。通过`e.isPropagationStopped()`来判断是否阻止事件冒泡。

  5. react 怎么通过`dom`元素，找到与之对应的`fiber`对象？

    * 按照`冒泡`、`捕获`的逻辑，查找 dom 元素对应的 fiber 对象

  6. `onClick`是在冒泡阶段绑定的？那么`onClickCapture`就是在事件捕获阶段绑定的吗？

    * 除了几个特殊事件比如`scroll`、`blur`、`focus`是在事件捕获节点绑定。其他事件都是在事件冒泡阶段进行绑定

## 为什么 react 采用合成事件的模式？

  1. 将事件绑定在`document`统一管理，防止很多事件直接绑定在原生的`dom`元素上，造成一些不可控的情况
  2. `react`想实现一个全平台的框架，为了实现这个目标，就需要一个事件系统来抹平不同平台的差异

## 事件初始化 - 事件合成，插件机制

> `react`并不是一次性把所有事件都绑定进去，而是如果发现项目中有事件，才将事件进行绑定，

### 插件类型

  1. SimpleEventPlugin
  2. EnterLeaveEventPlugin
  3. ChangeEventPlugin
  4. SelectEventPlugin
  5. BeforeInputEventPlugin

> `react`中，处理 props 中事件的时候，会根据不同的事件名称，找到对应的事件插件，然后统一绑定到`document`上。对于没有出现过的事件，就不会绑定。

### 事件初始化

  1. 注册事件插件

    * 形成以下格式

```js
namesToPlugins={
  SimpleEventPlugin,
  EnterLeaveEventPlugin,
  ChangeEventPlugin,
  SelectEventPlugin,
  BeforeInputEventPlugin,
}
```

  2. 最终形成以下插件格式

```js
{
  onBlur: SimpleEventPlugin,
  onClick: SimpleEventPlugin,
  onClickCapture: SimpleEventPlugin,
  onChange: ChangeEventPlugin,
  onChangeCapture: ChangeEventPlugin,
  onMouseEnter: EnterLeaveEventPlugin,
  onMouseLeave: EnterLeaveEventPlugin,
  ...
}
```

## 事件绑定

  1. 在 react 中，diff DOM 元素类型的 fiber 的 props 的时候，如果发现是 React 合成事件，比如`onClick`，会按照事件系统逻辑进行单独处理
  2. 根据 React 合成事件类型，找到对应的原生事件的类型，然后调用判断原生事件类型。大部分事件都按照冒泡逻辑处理，少数事件会按照捕获逻辑处理（比如 `scroll`、`focus`、`blur`等事件）
  3. 调用 `addTrappedEventListener`进行真正的事件绑定，绑定在`document`上，然后再做统一的事件处理函数
  4. 值得注意的一点：`只有上述的特殊事件，比如 scroll、focus、blur等是在事件捕获阶段绑定的`，其他事件都是在`冒泡阶段绑定的`。所以无论`onClick`还是`onClickCapture`都是在冒泡阶段绑定的

## 事件触发

  1. 首先通过统一的事件处理函数`dispatchEvent`，进行批量更新 `batchUpdate`
  2. 然后执行事件对应的处理插件中的`extractEvents`（事件系统的核心），
    1. 首先形成 react 事件独有的合成事件源对象，保存了整个事件的信息
    2. 然后声明事件执行队列，按照`冒泡`和`捕获`逻辑，从事件源开始逐渐向上，查找 dom 元素类型对应的 fiber 对象，收集上面 react 合成事件
    3. 最后将事件执行队列，保存到 react 事件源对象上。等待执行
  3. 最后通过`runEventInBatch`执行事件队列，如果发生阻止冒泡，则跳出循环，最后重置事件源，返回事件池，完成整个流程

### react 阻止事件冒泡和事件默认行为的方式

```js
// 阻止事件冒泡
// 通过调用事件上的 isPropagationStopped 方法来判断是否阻止事件冒泡
event.isPropagationStopped();
// 赋值给 isPropagationStopped = true

// 阻止事件默认行为 ？？
event.preventDefault();
```

## 事件池

> react 中采用了`事件池`的概念，每次执行事件时，都会从`事件池`中取出一个事件源对象，当事件函数执行完成后，将取出的事件源对象进行释放。这样的好处就是我们不必再创建事件源对象，减少事件的创建和销毁所占用的内存。这就是为什么当我们函数调用后，无法再次访问事件，但是可以通过调用`e.persist()`来将事件进行缓存，以便下次再需要使用时，可以再次进行访问

```js
 handerClick = (e) => {
  //  e 事件在调用完毕后就会被释放
  // 所以在 setTimeout 中无法访问到 e 事件
    console.log(e.target) // button 
    setTimeout(()=>{
        console.log(e.target) // null
    },0)
}
```

## React 17 事件系统的改变

  1. 事件不再绑定到 `document`,而是绑定到 根节点 container `ReactDOM.render(app, container)`。这样做的好处是`有利于微前端`。微前端一个前端系统中可能有多个应用，如果还是将事件绑定在`document`上，当多应用时可能会产生问题
  2. 取消了事件池的使用，也就解决了事件调用后，无法再次访问事件对象的问题
  3. `React 17` 支持了原生捕获事件的支持，对齐了浏览器原生标准。同时`onScroll`事件不再进行事件冒泡。`onFocus`、`onBlur`使用原生 `focusin`、`focusout`合成

## 参考

* [「react进阶」一文吃透react事件系统原理](https://juejin.cn/post/6955636911214067720)
