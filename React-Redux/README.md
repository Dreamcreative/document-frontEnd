# React-Redux v7.2.6

1. Provider 是怎么把 store 放入 context 中的

> Provider 将数据由顶层注入

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
// 创建监听器  Subscription 是 React-Redux 实现订阅更新的核心
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

> 组件被 connect 包裹之后才能拿到 state 和 dispatch

> 由 Selector 生成组件的 props

```js
// connect 使用 参数有两种方式
// 1. 函数 2. 对象

// 1. 参数为函数时
const mapStateToProps = (state, ownProps) => {
  const { counter } = state
  return {
    num: counter.num
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    increaseAction: () => dispatch({
      type: INCREASE
    }),
    decreaseAction: () => dispatch({
      type: DECREASE
    })
  }
}

connect(mapStateToProps, mapDispatchToProps)(Child);

// 2. 参数为对象时
const mapStateToProps =  {
    num: counter.num
}

const mapDispatchToProps = {
    increaseAction: () => dispatch({
      type: INCREASE
    }),
    decreaseAction: () => dispatch({
      type: DECREASE
    })
}
connect(mapStateToProps, mapDispatchToProps)(Child);
```

```js
function createConnect(
  connectHOC = connectAdvanced,
  mapStateToPropsFactories = defaultMapStateToPropsFactories,
  mapDispatchToPropsFactories = defaultMapDispatchToPropsFactories,
  mergePropsFactories = defaultMergePropsFactories,
  selectorFactory = defaultSelectorFactory,
){
  return function connect(
    mapStateToProps,
    mapDispatchToProps,
    mergeProps,
    {
      pure=true,
      areStatesEqual = strictEqual,
      areOwnPropsEqual = shallowEqual,
      areStatePropsEqual = shallowEqual,
      areMergedPropsEqual = shallowEqual,
      ...extraOptions
    } = {}
  ){
    // 返回一个 Selector 函数，根据 connect 传入的参数类型，来判断是否使用组件自身属性 props
    const initMapStateToProps = match(mapStateToProps, mapStateToPropsFactories, 'mapStateToProps');
    const initMapDispatchToProps = match(mapDispatchToProps, mapDispatchToPropsFactories, 'mapDispatchToProps');
    const initMergeProps = match(mergeProps, mergePropsFactories, 'mergeProps');
    // 以上过程
    // 生成 selector 函数 给 connectAdvanced() 执行
    // 合并 connect 传入的参数 mapStateToProps,mapDispatchToProps, mergeProps
    return connectHOC(selectorFactory,{
      methodName: 'connect',
      getDisplayName: (name)=> `Connect(${name})`,
      // 如果 mapStateToProps 没有传，则 Connect 组件不订阅 store 变化
      shouldHandleStateChanges: Boolean(mapStateToProps),
      initMapStateToProps,
      initMapDispatchToProps,
      initMergeProps,
      // 是否进行渲染优化，默认为 true ,重新渲染时，只有当 state 变化时才会渲染，为 false 时，每次都会重新渲染
      pure,
      areStatesEqual,
      areOwnPropsEqual,
      areStatePropsEqual,
      areMergedPropsEqual,
      ...extraOptions
    })
  }
}
```

```js
// arg : mapStateToProps、mapDispatchToProps、mergeProps 作为参数
// factories: 一个函数数组
// name: 执行报错时使用
function match(arg, factories, name){
  // 遍历函数数组，将 connect 传入的参数作为参数进行执行，如果有返回值，则返回
  for(let i = factories.length-1; i>=0 ;i++){
    const result = factories[i](arg);
    if(result) return result;
  }
}
```

```js
// 1. 取到 store 的 state 和 dispatch,以及 ownProps
// 2. 执行 selector
// 3. 将执行的返回值注入到 组件中
function connectAdvanced(
  selectorFactory,
  {
    getDisplayName = (name)=>`ConnectAdvanced(${name})`,
    methodName = 'connectAdvanced',
    renderCountProp = undefined,
    // 确定此 HOC 是否订阅 store 的更改
    shouldHandleStateChanges = true,
    storeKey = 'store',
    withRef = false,
    forwardRef = false,
    // 上下文
    context = ReactReduxContext,
    ...connectOptions
  } = {}
){
  const Context = context;
  return function wrapWithConnect(WrappedComponent){
    const wrappedComponentName = WrappedComponent.displayName || WrappedComponent.name || 'Component';
    const displayName = getDisplayName(wrappedComponentName);
    const selectorFactoryOptions = {
      ...connectOptions,
      getDisplayName,
      methodName,
      renderCountProp,
      shouldHandleStateChanges,
      storeKey,
      displayName,
      wrappedComponentName,
      WrappedComponent,
    };
    const {pure} = connectOptions;
    function ConnectFunction(props){
      const [propsContext, reactReduxForwardedRef, wrapperProps] =
        useMemo(() => {
          const { reactReduxForwardedRef, ...wrapperProps } = props
          return [props.context, reactReduxForwardedRef, wrapperProps]
        }, [props])
        // 缓存 使用 React-Redux 提供的 Context, 还是使用 connect 传入的 Context
      const ContextToUse = useMemo(()=>{
        return propsContext&&
          propsContext.Consumer && isContextConsumer(<propsContext.Consumer />)
          ? propsContext: Context;
      },[propsContext, Context])
      const renderedChild = useMemo(()=>{
        // 订阅 store 更新
        if(shouldHandleStateChanges){
          return (
            <ContextToUse.Provider value={overriddenContextValue}>{renderedWrappedComponent}</ContextToUse.Provider>
          )
        }
        // 不订阅 store 更新
        return renderedWrappedComponent;
      }, [ContextToUse, renderedWrappedComponent, overriddenContextValue])
    }
    // useLayoutEffect || useEffect
    useIsomorphicLayoutEffectWithArgs(
        subscribeUpdates,
        [
          shouldHandleStateChanges,
          store,
          subscription,
          childPropsSelector,
          lastWrapperProps,
          lastChildProps,
          renderIsScheduled,
          childPropsFromStoreUpdate,
          notifyNestedSubs,
          forceComponentUpdateDispatch,
        ],
        [store, subscription, childPropsSelector]
      )
    const Connect = pure ? React.memo(ConnectFunction): ConnectFunction;
    Connect.WrappedComponent = WrappedComponent;
    Connect.displayName = ConnectFunction.displayName = displayName;
    return hoistStatics(Connect, WrappedComponent)
  }
}
```

```js
// 订阅更新
function subscribeUpdates(
  // 是否订阅 state 更新
  shouldHandleStateChanges,
  store,
  // 订阅集合
  subscription,
  childPropsSelector,
  lastWrapperProps,
  lastChildProps,
  renderIsScheduled,
  childPropsFromStoreUpdate,
  notifyNestedSubs,
  forceComponentUpdateDispatch
  ){
    const checkForUpdates = ()=>{
      // 获取最新的 state
      const latestStoreState = store.getState();
      let newChildProps, error
      try{
        // 使用 selector 获取最新的 props
        newChildProps = childPropsSelector(
          latestStoreState,
          lastWrapperProps.current
        )
      }catch(e){
        error = e;
        lastThrownError = e;
      }
      if(!error){
        lastThrownError = null;
      }
      if(newChildProps === lastChildProps.current){
        // 如果 props 没有变化，通知一下 订阅函数更新
        if (!renderIsScheduled.current) {
          notifyNestedSubs()
        }
      }else{
        // 如果 props 有变化，将新的 props 缓存起来，同时将新的 props 设置到 childPropsFromStoreUpdate.current
        // 确保在执行时能够识别出 props 是更新了
        lastChildProps.current = newChildProps
        childPropsFromStoreUpdate.current = newChildProps
        renderIsScheduled.current = true

        // props 更新了，重新渲染组件
        forceComponentUpdateDispatch({
          type: 'STORE_UPDATED',
          payload: {
            error,
          },
        })
      }
      subscription.onStateChange = checkForUpdates;
      subscription.trySubscribe();
      // 在第一次渲染后从存储中提取数据，以防从开始渲染后存储发生改变
      checkForUpdates();
      // 解除订阅
      const unsubscribeWrapper=()=>{
        subscription.tryUnsubscribe()
        subscription.onStateChange = null
      }
      return unsubscribeWrapper;
    }
}
```

3. Redux 中，可以通过 `store.subscribe()` 订阅一个更新页面的函数，来实现 store 变化，更新 UI，而 `React-Redux` 是如何做到 store 变化，被 connect 的组件也会更新的

> Provider 将数据放入 context, connect 的时候会从 context 上取出 store，获取到 mapStateToProps, maDispatchToProps,使用 selectorFactory 生成 Selector 作为 props 注入组件。其次订阅 store 的变化，每次更新组件会取到最新的 props.

## 参考

* [带着问题看 React-Redux 源码（一万四千字长文预警）](https://zhuanlan.zhihu.com/p/80655889)