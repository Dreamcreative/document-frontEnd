# React16 流程

## ReactDOM.createElement

1. 默认调用 ReactDOM.createElement 返回 React 元素对象

- 为什么需要在 文件顶部引入 import React from 'react'

      - 因为 React 元素转为 React 元素对象需要默认调用 React.createElement(type, config, callback)

2. 生成 rootFiber 节点，初始化 fiber 节点属性
   - 初始化 rootFiber 节点的更新队列
   - 批量更新
3. 调度更新
   - 标记 fiber 更新时间

# Scheduler(调度器)-会根据 fiber 的优先级进行任务的中断

- 浏览器实现了 requestIdleCallback API,由于一些原因，react 没有采用

  1.  浏览器兼容性
  2.  requestIdleCallback 触发不稳定，比如，当浏览器切换了 tab 之后，之前 tab 注册的 requestIdleCallback 触发频率会变得很低

- react 实现了功能更完备的 requestIdleCallback Polyfill。除了在空闲时触发回调，Schedule 还提供了多种调度优先级供任务设置

## 作用

调度任务的优先级，高优任务优先进入 reconciler

# Reconciler(协调器)-render 阶段,找出节点中需要更新的部分，并打上 effectTag

- 接收到 Scheduler 的任务后，每次循环都会先判断当前是否还有剩余时间

  function workLoopConcurrent(){
  while( workInProgress!==null && !shouldYield()){
  workInProgress = performUnitOfWork(workInProgress)
  }
  }

- reconciler 为变化的虚拟 DOM 打上代表 增/删/更新的 effectTag 标记
- 当 当前组件都完成 Reconciler 的工作，会统一交给 Renderer

## performSyncWorkOnRoot

- 同步任务入口
- 调用

  function workLoopSync(){
  while(workInProgress!==null){
  performUnitOfWork(workInProgress)
  }
  }

## performConcurrentWorkOnRoot

- 异步任务入口
- 调用

  function workLoopConcurrent(){
  while(workInProgress!==null && !shouldYield()){
  performUnitOfWork(workInProgress)
  }
  }

## performUnitOfWork

### 递阶段

1. rootFiber 向下深度优先遍历，为遍历到的每个 fiber 节点调用 beginWork

#### beginWork

- current 存在时，表示 update;不存在时，表示 mount

1. mount 时，为节点创建 fiber 节点，为 根节点打上 effectTag 标记，其他子节点不需要打 effectTag 标记
2. update 时，为节点创建 fiber 节点，调用 DOM diff 为各个节点打上 effectTag 标记

##### reconcileChildren

1. current 不存在时(mount 阶段)，调用 mountChildFibers
2. current 存在时(update 阶段)，调用 reconcileChildFibers
3. mountChildFibers 与 reconcileChildFibers 逻辑基本一样，只是在 update 阶段时，会为有更新的 fiber 节点打上 effectTag 标记

###### mountChildFibers(mount 阶段)

- 只会给 rootFIber 节点打上 Placement effectTag 标记，其他子节点不会打标记，在 Renderer-commit 阶段，进行 rootFiber 节点的挂载
  - 为什么 mount 阶段只在 rootFiber 打 effectTag 标记，因为 如果给每个子 fiber 都打上 effectTag，那么在 mount 时所有 DOM 节点都会进行插入操作，消耗性能

##### reconcileChildFibers(update 阶段)

- 会为变化的 fiber 节点打上 effectTag 标记(会在 Renderer-commit 阶段时，根据不同的 effectTag 进行 增、删、更新等操作)
- 在这个阶段进行 DOM diff `reconcileChildrenArray(returnFiber, currentFirstChild, newChildren, lanes)`

### 归阶段

1. 调用 completeWork 处理 fiber 节点
2. 如果存在其兄弟 fiber 节点，继续进行 递阶段 调用 beginWork，
3. 如果不存在兄弟 fiber 节点，则进行父 fiber 节点的 归阶段，调用 completeWork
4. 一直到 rootFiber。
5. render 阶段结束

#### completeWork(current, workInProgress, renderLanes)

- 为 beginWork 阶段生成的 fiber 节点生成对应的 DOM 节点，并生成 DOM 树
- 使用 current 是否存在来判断当前是`mount阶段`还是`update阶段`
- current 存在时，表示 update;不存在时，表示 mount
  1.  update 时，主要处理 props 比如：
      1. onClick、onChange 等回调函数的注册
      2. 处理 style prop
      3. 处理 DANGEROUSLY_SET_INNER_HTML prop
      4. 处理 children prop
      5. 等等
  2.  mount 时，主要处理逻辑
      1. 为 fiber 节点生成对应的 DOM 节点
      2. 将子孙 DOM 节点插入父 DOM 节点
      3. 与 update 时相同，主要处理 DOM 节点上 props

##### createInstance

- 创建 DOM 节点
- 调用 document.createElement()方法

##### appendAllChildren

- 将 fiber 所有子节点 append 到 fiber 对应的 DOM 节点上

#### finalizeInitialChildren

- 初始化 DOM 节点属性 attribute 、事件初始化

## effectList (单向链表)

- elffectList 上保存着所有被打上了 effectTag 的 fiber 节点，

  - 在 归阶段 completeWork 中，遍历时，effectList.firstEffect 会保存第一个 fiber 节点， effectList.lastEffect 会保存最后一个 fiber 节点

  `rootFiber.firstEffect = nextEffect; rootFiber.firstEffect.nextEffect =nextEffect`

# Renderer(渲染器)-commit 阶段( 将更新后的 fiber 树渲染到页面上),同步执行,无法被中断

## commitRoot(root) root: fiberRootNode-页面的根节点，只有一个(#app)，rootFiber 组件的根节点

> fiberRootNode-页面的根节点: 这是不准确的，准确的说应该是，`#app` 容器的父级。因为 react 在创建 `#app` 元素的 fiber 节前，会先创建一个对象， 用来包裹 `#app` 元素的 fiber 节点

- commit 阶段入口 分为三个子阶段

  1.  `before mutation阶段`(执行 DOM 操作之前)

      1. 处理 blur/focus DOM 节点
      2. 遍历 effectList (`commitBeforeMutationEffects()`)
      3. 调用 commitBeforeMutationEffects (`ClassComponent 调用 生命周期函数 getSnapshotBeforeUpdate 钩子`)
      4. 在浏览器完成布局与绘制之后`异步调度` useEffect （只是调度起来，并不是真正的执行，真正的执行是在 `Renderer-Layout 阶段`）
         - 为什么异步调度
           1. useEffect 如果同步调用，阻塞浏览器的行为，导致各种问题

  2.  mutation 阶段(执行 DOM 操作)

      - 遍历 effectList (`commitMutationEffects()`)

        1.  根据 ContentReset effectTag `重置文本节点`
        2.  `解绑ref`
        3.  根据 effectList 上 fiber 节点上不同的 effectTag 执行 增/删/更新等操作
            - Placement 插入操作 (`commitPlacement`)
            - PlacementAndUpdate 插入并更新操作 (`commitPlacement() 、commitWork()`)
            - Update 更新操作 (`commitWork`)
            - Deletion 删除操作 (`commitDeletion()`)
        4.  `执行 useLayoutEffect 销毁函数`
        5.  完成 current 树的切换 `root.current = finishedWork`

            1. 为什么在此时切换 current 树

               - 因为在 `Mutation`阶段，所有的 DOM 节点完成渲染，`生命周期函数已经可以访问到真实的 DOM 节点`,如果不切换，会导致访问到的节点还是上一次渲染的节点，引起数据错误

  3.  layout 阶段(执行 DOM 操作之后, `DOM渲染完成`)

      1. 遍历 effectList (`commitLayoutEffects()`)

         1. `commitLayoutEffectOnFiber()`(调用生命周期钩子函数 、调用 hook 相关操作)

            1. ClassComponent : 根据 current 是否 === null 来判断是 mount 还是 update。

               - mount 时，调用 componentDidMount()钩子
               - update 时，调用 compomentDidUpdate()钩子

            2. FunctionComponent 等类型：

               - 调用`useLayoutEffect`回调函数
               - 调用`useEffect`的销毁和回调函数

               ```js
               function schedulePassiveEffects(finishedWork) {
                 enqueuePendingPassiveHookEffectUnmount(finishedWork, effect);
                 enqueuePendingPassiveHookEffectMount(finishedWork, effect);
               }
               ```

         2. `commitAttachRef()` 赋值 ref

      2. useEffect 相关的处理
      3. 性能追踪相关
      4. 触发生命周期钩子 例如(componentDidxxxx) 和 hook(如 useLayoutEffect 、useEffect)

- 调用 getSnapshotBeforeUpdate 生命周期钩子函数
  - React v16 开始 对 componentWillxxxx 这类钩子前添加了`UNSAFE_`前缀
    - 因为 fiber reconciler 调度在 Reconciler 协调器(render 阶段)会多次中断任务，所以组件对应的 componentWillxxxx 这类生命周期函数可能会被多次触发。导致行为与 React v15 不一致。因此，新增了 getSnapshotBeforeUpdate 这个生命周期钩子
    - getSnapshotBeforeUpdate 钩子在 commit 阶段 - before mutation 阶段调用，commit 阶段内是同步调用的， 所以不会出现多次触发的问题

事件系统 packages/react-dom/src/events
