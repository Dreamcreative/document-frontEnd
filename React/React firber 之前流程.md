# React fiber 之前流程

  1. Reconciler（收集节点变化）

    * React 通过 `setState`、`forceUpdate`、`ReactDOM.render`来触发更新

      1. 调用组件的 render 方法，将返回的 JSX 转化为`虚拟DOM`
      2. 将`虚拟DOM`和上次更新时的`虚拟DOM`对比
      3. 通过对比找到本次更新的`虚拟DOM`
      4. 通知 `Renderer`将变化的虚拟DOM渲染到页面上


  2. Renderer（更新/渲染节点）

    * 对某个更新节点执行完 `Reconciler`后，会通知`Renderer`进行更新

> React fiber 之前的版本，在 Reconciler 阶段，React `DOM DIFF` 是`递归执行更新的`。由于是`递归执行`，所以一旦开始就无法结束。

> 当节点层级太深，或者 diff 逻辑复杂，导致递归时间过长，`JS线程`一直被卡住，那么用户交互和渲染就会产生卡顿。

> Reconciler 和 Renderer 是`交替工作`的。当第一个节点在页面以及变化后，第二个节点再进入 Reconciler。由于整个过程是同步进行的.所以用户看来，所有节点都是同时更新的。如果中断更新，则会在页面上看到更新不完全的新的节点树
