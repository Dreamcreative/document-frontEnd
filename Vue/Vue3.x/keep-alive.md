# Vue3 缓存组件

## KeepAlive 总结

1. KeepAlive 具有独特的两个生命周期 activate/deactivate (组件激活/组件失活)

   1. 缓存组件激活状态生命周期的执行顺序， created()/mounted/activate()
   2. 缓存组件失活状态生命周期执行顺序，deactivate()

2. KeepAlive 具有 include/exclude/max 属性，

   1. include: 匹配到的组件进行缓存 (string|RegExp|(string|RegExp)[])
   2. exclude: 匹配到的组件不进行缓存 (string|RegExp|(string|RegExp)[])
   3. max: 最多缓存组件数，超出 max 后，会删除最早缓存的组件 (string|number) 默认最大值为10

3. 失活组件缓存在哪里

   1. KeepAlive 会创建一个 `div` 节点 `storageContainer`，用来存放失活的组件
   2. 当组件激活时，会将组件从 `storageContainer` 中，移动到活动的节点中
   3. 当组件失活时，会将组件从活动的节点中，移动到 `storageContainer` 中

4. KeepAlive 是如何处理缓存组件信息

   1. 通过 `Map()` 来存储缓存组件的 vnode
   2. 通过 `Set()` 来存储缓存组件的 key

## interface

```ts
// 缓存组件匹配规则 字符串 正则
type MatchPattern = string | RegExp | (string | RegExp)[];
interface KeepAliveProps {
  // 匹配到的组件被缓存
  include?: MatchPattern;
  // 匹配到的组件不会缓存
  exclude?: MatchPattern;
  // 组件最大缓存数量
  max?: string | number;
}
```

## KeepAlive 特有生命周期函数

```ts
interface KeepAliveContext {
  ...,
  // 组件激活时钩子函数
  activate: (vnode: VNode, container: RendererElement, anchor: RendererNode | null, isSVG: boolean, optimized: boolean) => void;
  // 组件失活时钩子函数
  deactivate: (vnode: VNode) => void;
}
```

## 缓存组件生命周期顺序

1. 缓存时：created()-> mounted()
2. 激活时：activate()
3. 失活时：deactivate()

## KeepAlive 组件实现

```js
const KeepAliveImpl={
  name:'KeepAlive',
  props:{
    include: [String, RegExp, Array],
    exclude: [String, RegExp, Array],
    max: [String, Number]
  },
  setup(props,{slots}){
    // 获取当前组件实例
    const instance = getCurrentInstance()!
    // 当前上下文
    const sharedContext = instance.ctx;
    // 使用 Map 来存储缓存组件
    const cache=new Map();
    // 使用 Set 来存储缓存的组件 key
    const keys=new Set();
    const parentSuspense = instance.suspense
    const {
      renderer:{
        p: patch,
        // 失活组件移动方法
        m:move,
        // 组件卸载方法
        um:_umount,
        // 创建 元素方法
        o:{createElement}
      }
    }= sharedContext
    // 挂载 失活组件的父节点
    const storageContainer= createElement('div');
    // 缓存组件激活状态
    sharedContext.activate=(vnode, container, anchor, isSVG, optimized)=>{
      // ! ts 非空断言
      const instance = vnode.component!
      // 将当前激活组件移动到主节点容器
      move(vnode, container, anchor, MoveType.ENTER, parentSuspense)
      patch(
        instance.vnode,
        vnode,
        container,
        anchor,
        instance,
        parentSuspense,
        isSVG,
        vnode.slotScopeIds,
        optimized
      )
      queuePostRenderEffect(()=>{
        instance.isDeactived = false
        if(instance.a){
          invokeArrayFns(instance.a)
        }
        const vnodeHook = vnode.props && vnode.props.onVnodeMounted
        if(vnodeHook){
          invokeVNodeHook(vnodeHook, instance.parent, vnode)
        }
      }, parentSuspense)
    }
    // 缓存失活状态
    sharedContext.deactivate=(vnode)=>{
      const instance = vnode.component!
      // 将失活组件移动到 vue 主动创建的失活容器
      move(vnode, storageContainer, null, MoveType.LEAVE, parentSuspense)
      queuePostRenderEffect(() => {
        if (instance.da) {
          invokeArrayFns(instance.da)
        }
        const vnodeHook = vnode.props && vnode.props.onVnodeUnmounted
        if (vnodeHook) {
          invokeVNodeHook(vnodeHook, instance.parent, vnode)
        }
        instance.isDeactivated = true
      }, parentSuspense)
    }
    // 卸载组件
    function umMount(vnode){
      // 重置组件的 flag 标识
      resetShapeFlag(vnode)
      // 卸载组件
      _unmount(vnode, instance, parentSuspense, true)
    }
    // 剔除缓存组件
    function pruneCache(filter?:(name:string)=> boolean){
      // 遍历缓存组件
      // 如果 filter 过滤函数 为true 时，剔除匹配到 组件名的组件
      cache.forEach((vnode, key)=>{
        const name = getComponentName(vnode.type)
        if(name && (!filter||!filter(name))){
          pruneCacheEntry(key)
        }
      })
    }
    // 剔除组件入口
    function pruneCacheEntry(key){
      // 从缓存组件中获取需要剔除的组件
      const cached = cache.get(key)
      if(!current || cache.type !== current.type){
        // 卸载组件
        unmount(cached)
      }else if(current){
        // current 存在时 重置 shapeFlag
        resetShapeFlag(current)
      }
      // 组件剔除后，从 cache keys 中 删除组件
      cache.delete(key)
      keys.delete(key)
    }
    // 监听 include/exclude
    // 当 include/exclude 变化时
    // 剔除匹配到的组件
    watch(
      ()=>[props.include, props.exclude],
      ([include, exclude])=>{
        include && pruneCache(name=> matchs(include, name))
        exclude && pruneCache(name=> !matchs(exclude, name))
      },
      { flush: 'post', deep: true }
    )
    let pendingCacheKey= null;
    // 组件渲染后，缓存组件
    const cacheSubtree=()=>{
      if(pendingCacheKey!==null){
        cache.set(pendingCacheKey,getInnerChild(instance.subTree))
      }
    }
    // 组件挂载
    onMount(cacheSubtree)
    // 组件更新
    onUpdate(cacheSubtree)
    // 组件将要卸载时
    onBeforeMount(()=>{
      // 遍历组件缓存 将将要卸载的组件从缓存中删除
      cache.forEach(cached=>{
        const {subTree, suspense}=instance
        const vnode = getInnerChild(subTree)
        if(cached.type === vnode.type){
          resetShapeFlag(vnode)
          const da = vnode.component!.da
          da&& queuePostRenderEffect(da, suspense)
          return
        }
        unmount(cached)
      })
    })
    // 最终返回
    return ()=>{
      pendingCacheKey=null
      // 如果 keepAlive 的子节点不存在 返回 null
      if(!slots.default){
        return null
      }
      // 获取 keepAlive 子节点
      const children =slots.default();
      // 只获取 keepAlive 子节点的第一个节点
      const rawVNode = children[0]
      if(children.length>0){
        // 多个子节点时 直接返回
        current=null;
        return children;
      }else if(!isVNode(rawVNode) ||
        (!(rawVNode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) &&
        !(rawVNode.shapeFlag & ShapeFlags.SUSPENSE))){
          // 不是 虚拟节点 、 状态组件 、SUSPENSE 组件
          current=null;
          return children;
      }
      // 根据 未处理的节点，获取真正的 虚拟节点
      let vnode = getInnerChild(rawVNode)
      // 节点类型
      const comp = vnode.type
      // 组件名称
      const name = getComponentName( isAsyncWrapper(vnode)? vnode.type.__asyncResolved ||{}:comp)

      const {include, exclude, max} = props;
      if(include && (!name || !matchs(include,name))||
        exclude && (name || matchs(exclude,name))
      ){
        current=vnode;
        return rawVNode
      }

      if(vnode.el){
        // 如果组件被重用，需要进行克隆，因为我们将对组件进行处理
        vnode = cloneVNode(vnode)
        if(rawVNode.shapeFlag & ShapeFlags.SUSPENSE){
          rawVNode.sscontent=vnode
        }
      }

      pendingCacheKey= key
      if(cacheVNode){
        vnode.el = cacheVNode.el
        vnode.component = cacheVNode.component
      }
      if(vnode.transition){
        setTransitionHook(vnode, vnode.transition)
        vnode.shapeFlag !=ShapeFlags.COMPONENT_KEPT_ALIVE
        keys.delete(key)
        keys.add(key)
      }else{
        keys.add(key)
        // 如果缓存组件个数超过了 max 的最大限制，将最早缓存的组件剔除
        if(max && keys.size>parseInt(max, 10)){
          pruneCacheEntry(keys.values().next().value)
        }
      }
      vnode.shapeFlag |= ShapeFlags.COMPONENT_SHOULD_KEEP_ALIVE
      current=vnode
      return isSuspense(rawVNode.type)?rawVNode: vnode
    }
  }
}
// 根据传入的 include/exclude 匹配组件
function matchs(pattern, name){
  if(isArray(pattern)){
    // 匹配是数组 每个都进行匹配
    return pattern.some(p=> matchs(p,name))
  }else if(isString(pattern)){
    // 匹配是 字符串 匹配 name
    return pattern.split(',').includes(name)
  }else if(pattern.test){
    // 匹配是正则 使用正则的 test 检查
    return pattern.test(name)
  }
  return false
}
// 获取 子节点
function getInnerChild(vnode){
  // 节点的 shapeFlag 不是 SUSPENSE,
  // 则返回 vnode.ssContent
  // 否则返回 vnode
  return vnode.shapeFlag & ShapeFlags.SUSPENSE?vnode.ssContent: vnode
}
```
