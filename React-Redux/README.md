# React-Redux

1. Provider 是怎么把 store 放入 context 中的

```js
/**
 import { Provider } from 'react-redux';

  <Provider store={store}>
      <App/>
    </Provider>
*/
/**
 * store 传入的 store
 * context 外部传入的 上下文
 * children 传入的子组件
*/


function Provider({store, context, children}){
  const contextValue = useMemo(()=>{
    // 创建一个监听器
    const subscription = createSubscription(store);
    // 绑定监听，当 state 变化时，通知订阅者更新页面，实际上就是在 connect 过程中被订阅到 subscription
    subscription.onStateChange = subscription.notifyNestedSub;
    // 返回 store 和监听器
    return {
      store,
      subscription
    }
  },[store]);
  // 保存之前的 state 值，用于与下一次 state 值进行比较，如果两次 state 不同，则更新 provider 组件
  const previousState = useMemo(()=> store.getState(),[store]);
  /**
   * useIsomorphicLayoutEffect 
   *    在 浏览器环境使用 useLayoutEffect
   *    在 服务器环境使用 useEffect
  */
  useIsomorphicLayoutEffect(()=>{
    // 获取当前订阅器
    const {subscription} = contextValue;
    // 开始更新订阅函数
    subscription.trySubscribe();
    if(previousState!== store.getState()){
      // 当 store 的 state 值变化时，通知订阅函数更新
      subscription.notifyNestSubs();
    }
    return ()=>{
      // 当组件卸载时，取消订阅和 state 变化绑定函数
      subscription.tryUnsubscribe();
      subscription.onStateChange = null;
    }
  },[contextValue, previousState])
  // ReactReduxContext = React.createContext()
  const Context = context || ReactReduxContext;
  // 将 contextValue 传入到 Context 上下文中
  return <Context.Provider value={contextValue}>{children}</Context.Provider>
}
```

```js
// 创建监听器
function createSubscription(store, parentSub){
  let unsubscribe;
  // nullListeners = {
  //   notify(){},
  //   get:()=>{}
  // }
  let listeners = nullListeners;
  // 添加订阅
  function addNestedSub(listener){
    trySubscribe();
    return listeners.subscribe(listener)
  }
  // 通知订阅更新
  function notifyNestedSubs(){
    listeners.notify();
  }
  function handleChangeWrapper(){
    if(subscription.onStateChage){
      subscription.onStateChage();
    }
  }
  // 是否订阅
  function isSubscribed(){
    return Boolean(unsubscribe);
  }
  function trySubscribe(){
    // parentSub 实际上是 subscription 实例
    // unsubscribe 不存在并且 parentSub 没传，则使用 store 订阅
    if(!unsubscribe){
      unsubscribe = parentSub? 
        parentSub.addNestedSub(handleChangeWrapper):
        store.subscribe(handleChangeWrapper);
      // 创建一个订阅集合
      listeners = createListenerCollection();
    }
  }
  // 取消订阅
  function tryUnsubscribe(){
    if(unsubscribe){
      unsubscribe();
      unsubscribe = undefined;
      listeners.clear();
      listeners = nullListener;
    }
  }
  return {
    addNestedSub,
    notifyNestedSubs,
    handleChangeWrapper,
    isSubscribed,
    trySubscribe,
    tryUnsubscribe,
    getListeners: () => listeners,
  }
}
```

```js
// 创建订阅集合
function createListenerCollection(){
  // getBatch = (callback) => callback();
  // 执行函数
  const batch = getBatch();
  let first = null;
  let last = null;
  return {
    // 取消所有监听函数
    clear(){
      first = null;
      last = null;
    },
    // 更新所有监听函数
    notify(){
      batch(()=>{
        let listenter = first;
        while(listenter){
          listenter.callback();
          listenter = listenter.next;
        }
      })
    },
    // 获取所有的监听函数
    get(){
      let listeners = [];
      let listener = first;
      while(listener){
        listeners.push(listeners);
        listener =listener.next;
      }
      return listeners;
    }
    // 添加订阅函数
    subscribe(callback){
      let listener = last = {
        callback,
        next:null,
        prev: last,
      };
      if (listener.prev) {
          listener.prev.next = listener
      } else {
          first = listener
      }
      // 返回一个 取消订阅函数
      return function unsubscribe() {
          if (!isSubscribed || first === null) return
          isSubscribed = false

          if (listener.next) {
              listener.next.prev = listener.prev
          } else {
              last = listener.prev
          }
          if (listener.prev) {
              listener.prev.next = listener.next
          } else {
              first = listener.next
          }
      }
    }
  }
}
```

> 当 store 变化时，`Context.Provider` 的 value 变化，通知监听函数更新

> 当页面卸载时，取消函数订阅

2. 如何向组件中注入 state 和 dispatch

3. Redux 中，可以通过 `store.subscribe()` 订阅一个更新页面的函数，来实现 store 变化，更新 UI，而 `React-Redux` 是如何做到 store 变化，被 connect 的组件也会更新的


## 参考

* [带着问题看 React-Redux 源码（一万四千字长文预警）](https://zhuanlan.zhihu.com/p/80655889)