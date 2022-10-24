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
