# Window

## IntersectionObserver(callback, options)
异步检测目标元素与祖先元素的相交情况

异步更新，
在react fiber中，属于优先级最低的更新

### 使用场景

#### 1. 懒加载

#### 2. 无限滚动

#### 。。。

### methods( prototype)

#### observe

##### 作用

###### 监听目标节点Element

##### Observer.observe(element)

#### unobserve

##### 作用

###### 取消目标节点Element的监听

##### Observer.unobserve(element)

#### disconnect

##### 作用

###### 取消所有监听

##### Observer.disconnect()

#### takeRecords

##### 返回所有观察目标IntersectionObserverEntry的对象数组

### 兼容性

#### 解决兼容

##### intesection-observer,js

##### 实现

###### 1. 判断window中是否存在
IntersectionObserver,
 IntersectionObserverEntry,
intersectionRatio是否存在于IntersectionObserverEntry.prototype，

如果不存在则使用MutationObserver进行监听

###### 2. 添加resize, scroll监听事件

###### 3. 使用 throttle 节流来延迟检测元素是否相交

### IntersectionObserverEntry

#### 从属于 IntersectionObserver接口

#### 描述目标元素与其根元素的相交状态

### 可选的 options配置

#### root: 根节点，为undefined、null时，默认为window

#### rootMargin: 根元素的外边距，类似于css margin属性

#### threshold:目标元素与根元素的相交程度 数组 0-1的值,[0, 0.5, 1]。
只有当目标元素与根元素相交为0、0.5、1时，会触发callback

## MutationObserver(callback)

异步更新

### 特点

#### 1. 等待DOM操作完成后，异步触发，为了应对频繁的DOM变动

#### 2. 所有的DOM变化添加到一个数组，批量处理，而不是一条条处理

#### 3. 可以同时监听DOM的所有类型变动，也可以值监听一种类型变动

### 作用

#### 提供了监听DOM树所做更改的能力

### methods

#### disconnect：解除所有元素监听

#### observe(element, options): 监听元素

##### element: 需要监听的目标元素

##### options: 需要监听目标元素哪些类型变化

###### attributeFilter <[] |null>： 需监听的属性名称的数组，无默认值

###### attributes<boolen>: 设置为true表示观察监听对象的属性变更

###### characterData：设置为true, 表示观察监听对象的字符变更,无默认值

###### childList <boolen>: 设置为true,表示监听目标对象节点(如果subtree为true,则包含子孙节点)的删除、添加。

###### subtree<boolen>: 设置为true, 表示将监听范围扩大至目标节点的所有节点

#### takeRecords: 从MutationObserver监听对象中删除所有待处理的通知
