# Window

## IntersectionObserver(callback, options)

> 异步检测目标元素与祖先元素的相交情况

> 异步更新，在 `React fiber`中，属于优先级最低的更新

### 使用场景

1. 懒加载
2. 无线滚动

### methods(prototype)

1. observe(element):监听目标节点
2. unobserve(element):取消目标节点的监听
3. disconnect(): 取消所有监听
4. takeRecords(): 返回所有观察目标 IntersectionObserverEntry 的对象数组

### 兼容性

![IntersectionObserver兼容性](/images/JavaScript/IntersectionObserver兼容性.png)

- [解决兼容性](https://github.com/w3c/IntersectionObserver/tree/main/polyfill)

### IntersectionObserverEntry

> 从属于 IntersectionObserver 接口。

> 描述目标元素与其根元素的相交状态

### 可选的 option 配置

1. root：根节点，为 undefined、null 时，默认为 window
2. rootMargin: 根元素的外边距，类似于 `css margin` 属性
3. threshold: 目标元素与根元素的相交程度，`数组 0-1`，[0,0.5,1],当目标元素与根元素相交为 0、0.5、1 时，会触发 callback

## MutationObserver(callback)

> 异步更新

### 特点

1. 等待 DOM 操作完成后，异步触发，为了应对频繁的 DOM 变动
2. 所有的 DOM 变化添加到一个数组，批量处理，而不是一条条处理
3. 可以同时监听 DOM 所有类型变动，也可以只监听一种类型变动

### 作用

> 提供了监听 DOM 数所做更改的能力

### methods

1. observe(element, options):监听元素

   - element:目标元素
   - options：需要监听目标元素那些类型变化

     1. `attributeFilter <[] |null>`：需要监听的属性名称的数组，无默认值
     2. `attributes<boolen>`：设置为 true 表示监听对象的属性变更
     3. `characterData`：设置为 true 表示监听对象的字符变更，无默认值
     4. `childList <boolen>`:设置为 true,表示监听目标对象节点（如果 subtree 为 true,则包含子孙节点）的删除、添加
     5. `subtree<boolean>`:设置为 true,表示监听范围扩大至目标节点的所有节点

2. takeRecords: 从 MutationObserver 监听对象中删除所有待处理的通知
