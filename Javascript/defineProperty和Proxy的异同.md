# Object.defineProperty 和 Proxy 的异同

## 相同点

1. 都能监听对象的变化

## 不同点

> `Object.defineProperty`通过监听对象的 getter 和 setter 完成对象的监听

1. 无法监听数组的变化，需要对数组方法进行修改
2. 无法监听新增和删除
3. 监听对象时，会将对象一次性递归监听

> `Proxy` 拦截，对对象访问时的拦截

1. 可以监听数组变化
2. 可以监听新增和删除
3. 只有当属性被访问到时，才会对属性值进行监听
4. 具有兼容性问题，
5. Proxy 无法监听 `Set`、`WeakSet`、`Map`、`WeakMap`等对象，使用了所谓的`内部插槽`，重写了这些对象的方法 `packages/reactivity/src/collectionHandlers.ts`
