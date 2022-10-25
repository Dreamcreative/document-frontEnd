# vue3 指令

```ts
// binding对象属性
interface DirectiveBinding<V = any> {
  // 使用指令的组件实例
  instance: ComponentPublicInstance | null;
  // 传递给指令的值
  value: V;
  // 之前传递给指令的值
  oldValue: V | null;
  // 传递给指令的参数
  arg?: string;
  // 修饰符对象
  modifiers: DirectiveModifiers;
  // 指令的定义对象
  dir: ObjectDirective<any, V>;
}
type DirectiveHook<T = any, Prev = VNode<any, T> | null, V = any> = (
  // 指令绑定节点
  el?: T,
  // 一个对象
  binding?: DirectiveBinding,
  // 指令绑定节点的虚拟节点
  vnode?: VNode<any, T>,
  // 更新之前的虚拟节点
  preVNode?: Prev
) => void;
// 指令生命周期和属性
interface ObjectDirective<T = any, V = any> {
  // 指令绑定元素之前
  created?: DirectiveHook<T, null, V>;
  // 元素被插入到DOM 之前
  beforeMount?: DirectiveHook<T, null, V>;
  // 指令绑定节点的父节点，以及父节点的所有子节点挂载完成后
  mounted?: DirectiveHook<T, null, V>;
  // 绑定指令节点的父节点 更新之前
  beforeUpdate?: DirectiveHook<T, VNode<any, T>, V>;
  // 绑定指令节点的父节点以及所有子节点 更新之后
  updated?: DirectiveHook<T, VNode<any, T>, V>;
  // 绑定指令节点的父节点卸载之前
  beforeUnmount?: DirectiveHook<T, null, V>;
  // 绑定指令节点的父节点卸载之后
  unmounted?: DirectiveHook<T, null, V>;
  getSSRProps?: SSRDirectiveHook;
  deep?: boolean;
}
```

## 自定义指令的两种方式

1. 需要所有指令的钩子函数

- prevnode 更新之前的虚拟节点 仅在 `beforeUpdate`、`updated` 生命周期可用。

```ts
const app = createApp({});

app.directive('demo', {
  created(el, binding, vnode, prevnode) {
    // 指令与元素绑定之前
  },
  beforeMount(el, binding, vnode, prevnode) {
    // 绑定指令的元素挂载之前
  },
  mounted(el, binding, vnode, prevnode) {
    // 绑定指令的元素 父节点，已经所有子节点挂载后
  },
  beforeUpdate(el, binding, vnode, prevnode) {
    // 绑定指令的元素 父节点更新之前
  },
  updated(el, binding, vnode, prevnode) {
    // 绑定指令的元素 父节点，以及所有子节点更新后
  },
  beforeUnmount(el, binding, vnode, prevnode) {
    // 绑定指令元素的父节点卸载之前
  },
  unmounted(el, binding, vnode, prevnode) {
    // 绑定指令元素的父节点卸载之后
  }
});
```

2. 简写方式

- 当自定义指令仅在 `mounted()`、`updated()`这两个钩子函数调用时，可以使用简写模式

```ts
const app = createApp({});
app.directive('demo', (el, binding) => {
  // 只在 mounted、updated 时调用
});
```

## 指令什么时候执行

1. mountElement(){}：挂载父节点时

```ts
mountElement(
  vnode: VNode,
  container: RendererElement,
  anchor: RendererNode | null,
  parentComponent: ComponentInternalInstance | null,
  parentSuspense: SuspenseBoundary | null,
  isSVG: boolean,
  slotScopeIds: string[] | null,
  optimized: boolean
  )
{
  const {..., dirs, props} = vnode;
  ...
  // 元素挂载时，如果元素存在指令，开始指令的 created
  if(dirs){
    invokeDirectiveHook(vnode, null, parentComponent,'created')
  }
  if(props){
    // 处理元素的属性
  }
  if(dirs){
    // 绑定指令的元素 的父元素 挂载之前
    invokeDirectiveHook(vnode, null, parentComponent, 'beforeMount')
  }
  // 父元素插入节点
  hostInsert(el, container, anchor)
  if (
    (vnodeHook = props && props.onVnodeMounted) ||
    needCallTransitionHooks ||
    dirs
  ){
    queuePostRenderEffect(()=>{
      ...
      // 父元素插入完成 挂载 绑定指令的元素
      dirs && invokeDirectiveHook(vnode, null, parentComponent,'mounted')
    }, parentSuspense)
  }
}
```

2. patchElement()：比对元素时

```ts
patchElement(
  n1: VNode,
  n2: VNode,
  parentComponent: ComponentInternalInstance | null,
  parentSuspense: SuspenseBoundary | null,
  isSVG: boolean,
  slotScopeIds: string[] | null,
  optimized: boolean
){
  let {patchFlag, dirs}=n2;
  if(dirs){
    // 更新元素前，执行指令的 beforeUpdate
    invokeDirectiveHook(n2, n1, parentComponent, 'beforeUpdate')
  }
  ...
  if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
    queuePostRenderEffect(() => {
      // 元素更新完成后，执行指令的 update
      dirs && invokeDirectiveHook(n2, n1, parentComponent, 'updated')
    }, parentSuspense)
  }
}
```

3. unmount()：元素卸载时

```ts
unmount(
  vnode,
  parentComponent,
  parentSuspense,
  doRemove = false,
  optimized = false
){
  const { dirs,shapeFlag }=vnode;
  const shouldInvokeDirs = shapeFlag & ShapeFlags.ELEMENT && dirs
  if(shouldInvokeDirs){
    // 元素卸载前 执行指令的 beforeUnmount
    invokeDirectiveHook(vnode, null, parentComponent, 'beforeUnmount')
  }
  ...
  if (
    (shouldInvokeVnodeHook &&
      (vnodeHook = props && props.onVnodeUnmounted)) ||
    shouldInvokeDirs
  ) {
    queuePostRenderEffect(() => {
      vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode)
      // 元素卸载后 执行指令的 unmounted
      shouldInvokeDirs &&
        invokeDirectiveHook(vnode, null, parentComponent, 'unmounted')
    }, parentSuspense)
  }
}
```

## invokeDirectiveHook()：执行指令

```ts
invokeDirectiveHook({
  // 当前元素虚拟节点
  vnode,
  // 上一次元素虚拟节点 只在 beforeUpdate、updated 存在
  prevVNode,
  // 父元素实例
  instance,
  // 指令生命周期名称
  name
}){
  // 获取元素的指令集
  const bindings=vnode.dirs
  // 获取上一次虚拟节点的指令集
  const oldBindings = prevVNode && prevVNode.dirs!
  for(let i=0;i<bindings.length;i++){
    // 遍历元素的每一个指令
    const binging =bindings[i]
    if(oldBindings){
      binding.oldValue=oldBindings[i].value
    }
    let hook=binding.dir[name]
    if(__COMPAT__ && !hook){
      // compat 模式下 指令钩子不存在，则使用 vue2 版本的指令钩子
      hook = mapCompatDirectiveHook(name, binding.dir, instance)
    }
    if(hook){
      pauseTracking()
      // 执行 指令钩子函数，同时处理错误
      callWithAsyncErrorHandling(hook, instance, ErrorCodes.DIRECTIVE_HOOK,
      [vnode.el, binding, vnode, prevVNode])
      resetTracking()
    }
  }
}
// vue2 版本的指令钩子
const legacyDirectiveHookMap = {
  beforeMount: 'bind',
  mounted: 'inserted',
  updated: ['update', 'componentUpdated'],
  unmounted: 'unbind'
}
mapCompatDirectiveHook(
  name,
  dir,
  instance
){
  // 兼容 vue2 版本的指令钩子函数
  const mappedName=legacyDirectiveHookMap[name]
  if(mappedName){
    // vue3 updated 对应 vue2 的 update/componentUpdated
    if(isArray(mappedName)){
      const hook = []
      mappedName.forEach(mapped=>{
        const mappedHook=dir[mapped]
        if(mappedHook){
          softAssertCompatEnabled(
            DeprecationTypes.CUSTOM_DIR,
            instance,
            mapped,
            name
          )
          hook.push(mappedHook)
        }
      })
      return hook.length ? hook : undefined
    }
  }else{
    if(dir(mappedName)){
      softAssertCompatEnabled(
        DeprecationTypes.CUSTOM_DIR,
        instance,
        mappedName,
        name
      )
    }
    return dir[mappedName]
  }
}
```
