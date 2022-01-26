# React16 流程
## ReactDOM.createElement

1. 默认调用 ReactDOM.createElement 返回 React 元素对象

 -  为什么需要在 文件顶部引入 import React from 'react'

		- 因为 React 元素转为 React 元素对象需要默认调用 React.createElement(type, config, callback)

2. 生成 rootFiber节点，初始化fiber节点属性
	*  初始化rootFiber节点的更新队列
	*  批量更新
3. 调度更新
  	* 标记fiber更新时间

# Scheduler(调度器)-会根据fiber的优先级进行任务的中断

*  浏览器实现了requestIdleCallback API,由于一些原因，react没有采用
     1. 浏览器兼容性
     2. requestIdleCallback触发不稳定，比如，当浏览器切换了tab之后，之前tab注册的requestIdleCallback触发频率会变得很低  

* react实现了功能更完备的 requestIdleCallback Polyfill。除了在空闲时触发回调，Schedule还提供了多种调度优先级供任务设置

## 作用

调度任务的优先级，高优任务优先进入 reconciler

# Reconciler(协调器)-render阶段,找出节点中需要更新的部分，并打上 effectTag

* 接收到Scheduler的任务后，每次循环都会先判断当前是否还有剩余时间
	
	function workLoopConcurrent(){
		while( workInProgress!==null && !shouldYield()){
			workInProgress = performUnitOfWork(workInProgress)
		}
	}
* reconciler为变化的虚拟DOM打上代表 增/删/更新的 effectTag 标记
* 当 当前组件都完成Reconciler的工作，会统一交给Renderer


## performSyncWorkOnRoot

* 同步任务入口
* 调用

	function workLoopSync(){
		while(workInProgress!==null){
			performUnitOfWork(workInProgress)
		}
	}

## performConcurrentWorkOnRoot

* 异步任务入口
* 调用

	function workLoopConcurrent(){
		while(workInProgress!==null && !shouldYield()){
			performUnitOfWork(workInProgress)
		}
	}
	
	
## performUnitOfWork

### 递阶段

1. rootFiber向下深度优先遍历，为遍历到的每个fiber节点调用beginWork

#### beginWork 

* current 存在时，表示update;不存在时，表示mount
1. mount时，为节点创建 fiber节点，为 根节点打上effectTag标记，其他子节点不需要打effectTag标记
2. update时，为节点创建fiber节点，调用 DOM diff 为各个节点打上 effectTag 标记

##### reconcileChildren 
1. current不存在时(mount阶段)，调用mountChildFibers
2. current存在时(update阶段)，调用reconcileChildFibers
3. mountChildFibers 与reconcileChildFibers 逻辑基本一样，只是在update阶段时，会为有更新的fiber节点打上 effectTag标记

###### mountChildFibers(mount阶段)

* 只会给rootFIber节点打上Placement effectTag标记，其他子节点不会打标记，在Renderer-commit阶段，进行rootFiber节点的挂载
	* 为什么mount阶段只在rootFiber打effectTag标记，因为 如果给每个子fiber都打上effectTag，那么在mount时所有DOM节点都会进行插入操作，消耗性能

##### reconcileChildFibers(update阶段)

* 会为变化的fiber节点打上effectTag标记(会在 Renderer-commit阶段时，根据不同的effectTag进行 增、删、更新等操作)
* 在这个阶段进行DOM diff `reconcileChildrenArray(returnFiber, currentFirstChild, newChildren, lanes)`


### 归阶段

1. 调用completeWork处理fiber节点
2. 如果存在其兄弟fiber节点，继续进行 递阶段 调用beginWork，
3. 如果不存在兄弟fiber节点，则进行父fiber节点的 归阶段，调用completeWork
4. 一直到rootFiber。
5. render阶段结束

#### completeWork(current, workInProgress, renderLanes)

* 为beginWork阶段生成的fiber节点生成对应的DOM节点，并生成DOM树
* 使用 current 是否存在来判断当前是`mount阶段`还是`update阶段`
* current 存在时，表示update;不存在时，表示mount
	1. update时，主要处理props 比如：
		1. onClick、onChange等回调函数的注册
		2. 处理style prop
		3. 处理DANGEROUSLY_SET_INNER_HTML prop
		4. 处理children prop 
		5. 等等
	2. mount时，主要处理逻辑
		1. 为fiber节点生成对应的DOM节点
		2. 将子孙DOM节点插入父DOM节点
		3. 与update时相同，主要处理DOM节点上props  

##### createInstance 

* 创建DOM节点
* 调用document.createElement()方法

##### appendAllChildren 

* 将fiber所有子节点 append到fiber对应的DOM节点上

#### finalizeInitialChildren

* 初始化DOM节点属性 attribute 、事件初始化

## effectList (单向链表)

* elffectList 上保存着所有被打上了effectTag的fiber节点，
	* 在 归阶段 completeWork中，遍历时，effectList.firstEffect 会保存第一个 fiber节点， effectList.lastEffect会保存最后一个fiber节点

	`rootFiber.firstEffect = nextEffect; rootFiber.firstEffect.nextEffect =nextEffect`

# Renderer(渲染器)-commit阶段( 将更新后的fiber树渲染到页面上),同步执行,无法被中断

## commitRoot(root) root: fiberRootNode-页面的根节点，只有一个(#app)，rootFiber 组件的根节点

* commit 阶段入口 分为三个子阶段
	1. `before mutation阶段`(执行DOM操作之前)
		1. 处理 blur/focus DOM 节点
		2. 遍历effectList (`commitBeforeMutationEffects()`)
		3. 调用 commitBeforeMutationEffects (`调用 生命周期函数 getSnapshotBeforeUpdate 钩子`)
		4. 在浏览器完成布局与绘制之后`异步调度` useEffect （只是调度起来，并不是真正的执行，真正的执行是在 `Renderer-Layout 阶段`）
			* 为什么异步调度
				1. useEffect如果同步调用，阻塞浏览器的行为，导致各种问题
 
	2. mutation阶段(执行DOM操作)
		* 遍历effectList (`commitMutationEffects()`)
			1. 根据ContentReset effectTag `重置文本节点`
			2. `解绑ref`
			3. 根据effectList上fiber节点上不同的 effectTag 执行 增/删/更新等操作
				* Placement 插入操作 (`commitPlacement`) 
				* PlacementAndUpdate 插入并更新操作 (`commitPlacement() 、commitWork()`)
				* Update 更新操作 (`commitWork`)
				* Deletion 删除操作 (`commitDeletion()`)
			4. `执行 useLayoutEffect 销毁函数`
			5. 完成 current 树的切换 `root.current = finishedWork`
				
				1. 为什么在此时切换 current 树

					* 因为在 `Mutation`阶段，所有的 DOM 节点完成渲染，`生命周期函数已经可以访问到真实的 DOM 节点`,如果不切换，会导致访问到的节点还是上一次渲染的节点，引起数据错误
			
	3. layout阶段(执行DOM操作之后, `DOM渲染完成`)
		1. 遍历effectList (`commitLayoutEffects()`) 	
			1. `commitLayoutEffectOnFiber()`(调用生命周期钩子函数 、调用hook相关操作)
				1. ClassComponent  : 根据current 是否 === null 来判断是mount还是update。
					* mount时，调用componentDidMount()钩子
					* update时，调用compomentDidUpdate()钩子

				2. FunctionComponent 等类型： 
					* 调用`useLayoutEffect`回调函数
					* 调用`useEffect`的销毁和回调函数

					```js
						function schedulePassiveEffects(finishedWork){
							enqueuePendingPassiveHookEffectUnmount(finishedWork, effect);
							enqueuePendingPassiveHookEffectMount(finishedWork, effect);
						}
					```
			2. `commitAttachRef()` 赋值ref

		2. useEffect相关的处理
		3. 性能追踪相关 
		4. 触发生命周期钩子 例如(componentDidxxxx) 和hook(如 useLayoutEffect 、useEffect)

* 调用 getSnapshotBeforeUpdate生命周期钩子函数
	* React v16开始 对 componentWillxxxx这类钩子前添加了`UNSAFE_`前缀
		* 因为 fiber reconciler调度在Reconciler协调器(render阶段)会多次中断任务，所以组件对应的 componentWillxxxx这类生命周期函数可能会被多次触发。导致行为与React v15不一致。因此，新增了 getSnapshotBeforeUpdate这个生命周期钩子
		* getSnapshotBeforeUpdate钩子在commit阶段 - before mutation阶段调用，commit阶段内是同步调用的， 所以不会出现多次触发的问题

事件系统 packages/react-dom/src/events
